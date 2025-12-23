import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe/client";
import Stripe from "stripe";

/**
 * Manual sync endpoint to update subscription from Stripe
 * Useful for testing when webhooks aren't configured yet
 *
 * GET /api/sync-subscription
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripe = getStripeClient();

    // Try to get Stripe customer ID from database first
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let customerId: string | null =
      (subscription as { stripe_customer_id?: string } | null)
        ?.stripe_customer_id || null;

    // If no customer ID in database, try to find it in Stripe by email
    if (!customerId && user.email) {
      try {
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1,
        });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        }
      } catch (error) {
        console.error("Error looking up customer by email:", error);
      }
    }

    if (!customerId) {
      return NextResponse.json(
        {
          error: "No Stripe customer found. Please complete a checkout first.",
        },
        { status: 404 }
      );
    }

    // Get all subscriptions for this customer
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 1,
    });

    if (stripeSubscriptions.data.length === 0) {
      return NextResponse.json(
        { error: "No active subscription found in Stripe" },
        { status: 404 }
      );
    }

    const stripeSubscription: Stripe.Subscription = stripeSubscriptions.data[0];
    const priceId = stripeSubscription.items.data[0].price.id;

    // Determine plan type from price ID
    let planType: "free" | "pro" | "enterprise" = "pro";
    if (
      priceId === "price_1SejaLKoI2CWEIGNbnbZJtLR" ||
      priceId === "price_1SejaLKoI2CWEIGNzhsrBDJk"
    ) {
      planType = "enterprise";
    } else if (
      priceId === "price_1SejUcKoI2CWEIGNx0ju4db2" ||
      priceId === "price_1SejXOKoI2CWEIGNg0hVXHsp"
    ) {
      planType = "pro";
    }

    // Update subscription using admin client (bypasses RLS)
    const adminSupabase = await createAdminClient();

    // Determine status with proper type casting
    let subscriptionStatus:
      | "active"
      | "canceled"
      | "past_due"
      | "trialing"
      | "incomplete" = "active";
    if (stripeSubscription.status === "active") {
      subscriptionStatus = "active";
    } else if (stripeSubscription.status === "trialing") {
      subscriptionStatus = "trialing";
    } else if (stripeSubscription.status === "canceled") {
      subscriptionStatus = "canceled";
    } else if (stripeSubscription.status === "past_due") {
      subscriptionStatus = "past_due";
    } else {
      subscriptionStatus = "incomplete";
    }

    // Extract period dates - cast to access properties that exist at runtime
    const subscriptionWithPeriod = stripeSubscription as Stripe.Subscription & {
      current_period_start: number;
      current_period_end: number;
    };
    const periodStart = subscriptionWithPeriod.current_period_start;
    const periodEnd = subscriptionWithPeriod.current_period_end;

    // Check if subscription already exists for this user
    const { data: existingSub } = await adminSupabase
      .from("subscriptions")
      .select("id, stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    const subscriptionData: Record<string, unknown> = {
      stripe_customer_id: customerId,
      stripe_subscription_id: stripeSubscription.id,
      plan_type: planType,
      status: subscriptionStatus,
      current_period_start: new Date(periodStart * 1000).toISOString(),
      current_period_end: new Date(periodEnd * 1000).toISOString(),
    };

    let updateError;
    if (existingSub) {
      // Update existing subscription
      const result = await adminSupabase
        .from("subscriptions")
        // @ts-expect-error - Admin client types are not fully inferred
        .update(subscriptionData)
        .eq("user_id", user.id);
      updateError = result.error;
    } else {
      // Insert new subscription
      const result = await adminSupabase
        .from("subscriptions")
        // @ts-expect-error - Admin client types are not fully inferred
        .insert({
          ...subscriptionData,
          user_id: user.id,
        });
      updateError = result.error;
    }

    if (updateError) {
      console.error("Error updating subscription:", updateError, {
        userId: user.id,
        customerId,
        subscriptionId: stripeSubscription.id,
        planType,
      });
      return NextResponse.json(
        {
          error: "Failed to update subscription",
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    console.log(`Subscription synced successfully for user ${user.id}:`, {
      planType,
      status: stripeSubscription.status,
      customerId,
    });

    return NextResponse.json({
      success: true,
      message: "Subscription synced successfully",
      planType,
      status: stripeSubscription.status,
      customerId,
      subscriptionId: stripeSubscription.id,
    });
  } catch (error) {
    console.error("Error syncing subscription:", error);
    return NextResponse.json(
      {
        error: "Failed to sync subscription",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
