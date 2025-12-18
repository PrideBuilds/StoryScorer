import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripeClient } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendSubscriptionEmail,
  sendPaymentFailedEmail,
} from "@/lib/email/send";
import { getPlanById } from "@/lib/config/pricing";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event;

  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const supabase = await createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!subscriptionId) {
          console.error("No subscription ID in checkout session");
          break;
        }

        // Get user ID from session metadata (we set this in checkout)
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId || "pro";

        if (!userId) {
          console.error("No user ID found in checkout session metadata");
          break;
        }

        // Get subscription details from Stripe
        const stripe = getStripeClient();
        const subscription: Stripe.Subscription =
          await stripe.subscriptions.retrieve(subscriptionId);

        // Determine plan type from metadata or price ID
        let planType = planId as "free" | "pro" | "enterprise";
        if (!["free", "pro", "enterprise"].includes(planType)) {
          // Fallback: try to determine from price ID
          const priceId = subscription.items.data[0].price.id;
          if (
            priceId.includes("enterprise") ||
            priceId === "price_1SejaLKoI2CWEIGNbnbZJtLR"
          ) {
            planType = "enterprise";
          } else if (
            priceId.includes("pro") ||
            priceId === "price_1SejUcKoI2CWEIGNx0ju4db2"
          ) {
            planType = "pro";
          } else {
            planType = "pro"; // Default
          }
        }

        // Check if subscription already exists for this user
        const { data: existingSub } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        // Determine status with proper type casting
        let subscriptionStatus:
          | "active"
          | "canceled"
          | "past_due"
          | "trialing"
          | "incomplete" = "active";
        if (subscription.status === "active") {
          subscriptionStatus = "active";
        } else if (subscription.status === "trialing") {
          subscriptionStatus = "trialing";
        } else if (subscription.status === "canceled") {
          subscriptionStatus = "canceled";
        } else if (subscription.status === "past_due") {
          subscriptionStatus = "past_due";
        } else {
          subscriptionStatus = "incomplete";
        }

        const subscriptionData: Record<string, unknown> = {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan_type: planType,
          status: subscriptionStatus,
          current_period_start: new Date(
            subscription.current_period_start * 1000
          ).toISOString(),
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
        };

        let updateError;
        if (existingSub) {
          // Update existing subscription
          const result = await supabase
            .from("subscriptions")
            // @ts-expect-error - Admin client types are not fully inferred
            .update(subscriptionData)
            .eq("user_id", userId);
          updateError = result.error;
        } else {
          // Insert new subscription
          const result = await supabase
            .from("subscriptions")
            // @ts-expect-error - Admin client types are not fully inferred
            .insert({
              ...subscriptionData,
              user_id: userId,
            });
          updateError = result.error;
        }

        if (updateError) {
          console.error("Error updating subscription:", updateError);
        } else {
          console.log(`Subscription created/updated for user: ${userId}`);

          // Send subscription confirmation email
          const plan = getPlanById(planType);
          const amount = subscription.items.data[0]?.price?.unit_amount
            ? `$${(subscription.items.data[0].price.unit_amount / 100).toFixed(2)}`
            : undefined;
          const billingPeriod =
            subscription.items.data[0]?.price?.recurring?.interval || "month";

          // Get user email
          const { data: userData } =
            await supabase.auth.admin.getUserById(userId);
          const userEmail =
            userData?.user?.email || session.customer_email || "";

          if (userEmail) {
            sendSubscriptionEmail({
              userEmail,
              planName: plan?.name || planType,
              amount,
              billingPeriod,
            }).catch((error) => {
              console.error("Failed to send subscription email:", error);
            });
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const { data: subscriptionData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (!subscriptionData) {
          console.error(`Subscription not found for customer: ${customerId}`);
          break;
        }

        // Determine plan type from price ID
        const priceId = subscription.items.data[0].price.id;
        let planType: "free" | "pro" | "enterprise" = "pro";

        // Match price IDs from config
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

        // Determine status with proper type casting
        let subscriptionStatus:
          | "active"
          | "canceled"
          | "past_due"
          | "trialing"
          | "incomplete" = "active";
        if (subscription.status === "active") {
          subscriptionStatus = "active";
        } else if (subscription.status === "trialing") {
          subscriptionStatus = "trialing";
        } else if (subscription.status === "canceled") {
          subscriptionStatus = "canceled";
        } else if (subscription.status === "past_due") {
          subscriptionStatus = "past_due";
        } else {
          subscriptionStatus = "incomplete";
        }

        // Update subscription
        const updateData: Record<string, unknown> = {
          stripe_subscription_id: subscription.id,
          plan_type: planType,
          status: subscriptionStatus,
          current_period_start: new Date(
            subscription.current_period_start * 1000
          ).toISOString(),
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
        };
        await supabase
          .from("subscriptions")
          // @ts-expect-error - Admin client types are not fully inferred
          .update(updateData)
          .eq("stripe_customer_id", customerId);

        console.log(`Subscription ${event.type} for customer: ${customerId}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Update subscription status to canceled
        const cancelData: Record<string, unknown> = { status: "canceled" };
        await supabase
          .from("subscriptions")
          // @ts-expect-error - Admin client types are not fully inferred
          .update(cancelData)
          .eq("stripe_customer_id", customerId);

        console.log(`Subscription canceled for customer: ${customerId}`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id || null;

        if (subscriptionId) {
          // Update subscription period if needed
          const stripe = getStripeClient();
          const subscription: Stripe.Subscription =
            await stripe.subscriptions.retrieve(subscriptionId as string);

          const paymentData: Record<string, unknown> = {
            status: "active",
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          };
          await supabase
            .from("subscriptions")
            // @ts-expect-error - Admin client types are not fully inferred
            .update(paymentData)
            .eq("stripe_subscription_id", subscriptionId);

          console.log(`Payment succeeded for subscription: ${subscriptionId}`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const pastDueData: Record<string, unknown> = { status: "past_due" };
        await supabase
          .from("subscriptions")
          // @ts-expect-error - Admin client types are not fully inferred
          .update(pastDueData)
          .eq("stripe_customer_id", customerId);

        console.log(`Payment failed for customer: ${customerId}`);

        // Get user email from subscription
        const { data: subscriptionData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (subscriptionData) {
          // Get user email
          const { data: userData } = await supabase.auth.admin.getUserById(
            subscriptionData.user_id
          );

          if (userData?.user?.email) {
            const amount = invoice.amount_due
              ? `$${(invoice.amount_due / 100).toFixed(2)}`
              : "N/A";
            const lastPaymentDate = new Date(
              invoice.created * 1000
            ).toLocaleDateString();

            // Get next retry date if available
            const nextPaymentAttempt = invoice.next_payment_attempt
              ? new Date(
                  invoice.next_payment_attempt * 1000
                ).toLocaleDateString()
              : undefined;

            sendPaymentFailedEmail({
              userEmail: userData.user.email,
              amount,
              lastPaymentDate,
              retryDate: nextPaymentAttempt,
            }).catch((error) => {
              console.error("Failed to send payment failed email:", error);
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
