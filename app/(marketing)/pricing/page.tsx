"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { plans } from "@/lib/config/pricing";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckout = async (planId: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setLoadingPlan(planId);

    try {
      // In a real app, you'd get the price ID from your Stripe products
      // For now, we'll use placeholder price IDs that you'll need to replace
      const priceId = plans.find((p) => p.id === planId)?.stripePriceId?.[
        billingPeriod
      ];

      if (!priceId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Price ID not configured. Please contact support.",
        });
        setLoadingPlan(null);
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          planId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Checkout API error:", data);
        throw new Error(
          data.message || data.error || "Failed to create checkout session"
        );
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to start checkout",
      });
      setLoadingPlan(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Choose the plan that&apos;s right for you
        </p>

        {/* Billing Period Toggle */}
        <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
          <Button
            variant={billingPeriod === "monthly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingPeriod("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={billingPeriod === "annual" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingPeriod("annual")}
          >
            Annual
            <Badge variant="secondary" className="ml-2">
              Save 17%
            </Badge>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => {
          const price =
            billingPeriod === "annual" && plan.price.annual
              ? plan.price.annual
              : plan.price.monthly;
          const isRecommended = plan.recommended;

          return (
            <Card
              key={plan.id}
              className={`relative ${isRecommended ? "border-primary shadow-lg scale-105" : ""}`}
            >
              {isRecommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary">Recommended</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${price}</span>
                  <span className="text-muted-foreground">
                    /{billingPeriod === "annual" ? "year" : "month"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={isRecommended ? "default" : "outline"}
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loadingPlan === plan.id || plan.id === "free"}
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : plan.id === "free" ? (
                    "Current Plan"
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold mb-2">Can I change plans later?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time from your
              billing settings.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              What happens if I exceed my limit?
            </h3>
            <p className="text-sm text-muted-foreground">
              You&apos;ll be notified when you&apos;re approaching your limit and can
              upgrade to continue using the service.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
            <p className="text-sm text-muted-foreground">
              We offer a 30-day money-back guarantee for all paid plans.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can cancel your subscription at any time. You&apos;ll retain
              access until the end of your billing period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
