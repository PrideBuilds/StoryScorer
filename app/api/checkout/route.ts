import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe/client";
import { getPlanById } from "@/lib/config/pricing";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // Verify Stripe is configured first
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Stripe is not configured. Please contact support." },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting for checkout
    const rateLimit = checkRateLimit(`user:${user.id}`, RATE_LIMITS.checkout);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many checkout attempts. Please wait ${rateLimit.retryAfter} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { priceId, planId } = body;

    // Validate input
    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json(
        { error: "Price ID is required and must be a string" },
        { status: 400 }
      );
    }

    if (!planId || typeof planId !== "string") {
      return NextResponse.json(
        { error: "Plan ID is required and must be a string" },
        { status: 400 }
      );
    }

    if (!priceId || !planId) {
      return NextResponse.json(
        { error: "Price ID and Plan ID are required" },
        { status: 400 }
      );
    }

    // Verify plan exists
    const plan = getPlanById(planId as "free" | "pro" | "enterprise");
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Verify price exists in Stripe before creating checkout
    const stripe = getStripeClient();
    try {
      const price = await stripe.prices.retrieve(priceId);
      console.log(
        `Price verified: ${price.id} - ${price.unit_amount ? `$${(price.unit_amount / 100).toFixed(2)}` : "N/A"}`
      );
    } catch (priceError: unknown) {
      console.error("Price verification error:", priceError);
      if (
        priceError &&
        typeof priceError === "object" &&
        "code" in priceError &&
        priceError.code === "resource_missing"
      ) {
        return NextResponse.json(
          {
            error: "Price not found in Stripe",
            message: `The price ID "${priceId}" does not exist in your Stripe account.`,
            details: [
              "Please verify:",
              "1. The price ID is correct in your Stripe Dashboard → Products",
              "2. You're using the correct Stripe API keys (test vs live)",
              "3. The API keys match the Stripe account where prices were created",
            ].join("\n"),
            priceId: priceId,
          },
          { status: 400 }
        );
      }
      // If it's an authentication error, that's a different issue
      if (
        priceError &&
        typeof priceError === "object" &&
        "type" in priceError &&
        priceError.type === "StripeAuthenticationError"
      ) {
        return NextResponse.json(
          {
            error: "Stripe authentication failed",
            message:
              "Invalid Stripe API key. Please check your STRIPE_SECRET_KEY.",
          },
          { status: 401 }
        );
      }
      // For other errors, log but continue (might be temporary)
      const errorMessage =
        priceError && typeof priceError === "object" && "message" in priceError
          ? String(priceError.message)
          : String(priceError);
      console.warn(
        "Price verification warning, continuing anyway:",
        errorMessage
      );
    }

    // Get or create Stripe customer
    let customerId: string;

    // Check if user already has a Stripe customer ID
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    const subscriptionData = existingSubscription as {
      stripe_customer_id?: string;
    } | null;
    if (subscriptionData?.stripe_customer_id) {
      customerId = subscriptionData.stripe_customer_id;
    } else {
      try {
        const stripe = getStripeClient();
        // Create new Stripe customer
        const customer = await stripe.customers.create({
          email: user.email!,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;
      } catch (stripeCustomerError: unknown) {
        console.error("Error creating Stripe customer:", stripeCustomerError);
        return NextResponse.json(
          {
            error: "Failed to create customer",
            message:
              stripeCustomerError.message || "Stripe customer creation failed",
          },
          { status: 500 }
        );
      }

      // Note: We don't insert subscription here because RLS prevents user inserts
      // The webhook will create the subscription record when checkout.session.completed fires
    }

    // Create checkout session
    let session;
    try {
      const stripe = getStripeClient();
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?checkout=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing?checkout=cancelled`,
        metadata: {
          userId: user.id,
          planId: planId,
          email: user.email!,
        },
      });
    } catch (stripeError: unknown) {
      console.error("Stripe API error:", stripeError);
      return NextResponse.json(
        {
          error: "Failed to create checkout session",
          message: stripeError.message || "Stripe API error",
          details: stripeError.type || "unknown",
        },
        { status: 500 }
      );
    }

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to generate checkout URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
