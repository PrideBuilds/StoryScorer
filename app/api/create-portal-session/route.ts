import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";

export async function POST() {
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

    // Get user's Stripe customer ID
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    const subscriptionData = subscription as {
      stripe_customer_id?: string;
    } | null;

    if (!subscriptionData?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    // Create portal session
    const stripe = getStripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: subscriptionData.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      {
        error: "Failed to create portal session",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
