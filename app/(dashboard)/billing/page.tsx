import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ManageBillingButton } from "@/components/billing/ManageBillingButton";
import { UsageMeter } from "@/components/billing/UsageMeter";
import { CreditCard, Calendar, CheckCircle2 } from "lucide-react";
import { getPlanById } from "@/lib/config/pricing";
import { getUserStats } from "@/lib/db/stats";
import type { Subscription } from "@/types/database";

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Type assertion to fix TypeScript inference issue
  const typedSubscription = (subscription as Subscription | null) ?? null;

  // Get stats
  const stats = await getUserStats();

  const plan = typedSubscription
    ? getPlanById(typedSubscription.plan_type)
    : getPlanById("free");

  const currentPlan = typedSubscription?.plan_type || "free";
  const isActive = typedSubscription?.status === "active";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription plan</CardDescription>
            </div>
            <Badge variant={isActive ? "default" : "secondary"}>
              {typedSubscription?.status || "Free"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold">{plan?.name}</span>
              {plan && plan.price.monthly > 0 && (
                <span className="text-muted-foreground">
                  ${plan.price.monthly}/month
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{plan?.description}</p>
          </div>

          {typedSubscription && (
            <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Next Billing Date</p>
                  <p className="text-sm text-muted-foreground">
                    {typedSubscription.current_period_end
                      ? new Date(
                          typedSubscription.current_period_end
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              {typedSubscription.stripe_customer_id && (
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground">
                      Manage in Stripe portal
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {typedSubscription && typedSubscription.status === "active" && (
            <div className="pt-4">
              <ManageBillingButton />
            </div>
          )}

          {currentPlan === "free" && (
            <div className="pt-4">
              <Button asChild>
                <a href="/pricing">Upgrade Plan</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage */}
      {plan && (
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>
              Track your usage against your plan limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsageMeter
              current={stats.currentMonthStories || 0}
              limit={plan.limits.analysesPerMonth}
              planType={currentPlan}
            />
          </CardContent>
        </Card>
      )}

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
          <CardDescription>
            What&apos;s included in your current plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {plan?.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
