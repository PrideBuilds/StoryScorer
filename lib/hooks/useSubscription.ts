"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Subscription } from "@/types/database";
import { getPlanById } from "@/lib/config/pricing";

interface SubscriptionData {
  subscription: Subscription | null;
  plan: ReturnType<typeof getPlanById> | null;
  loading: boolean;
  error: string | null;
}

export function useSubscription() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscription: null,
    plan: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchSubscription() {
      try {
        const supabase = createClient();

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (mounted) {
            setSubscriptionData({
              subscription: null,
              plan: getPlanById("free"),
              loading: false,
              error: null,
            });
          }
          return;
        }

        // Fetch subscription
        const { data: subscription, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (subscriptionError && subscriptionError.code !== "PGRST116") {
          throw subscriptionError;
        }

        const planType = (subscription?.plan_type || "free") as
          | "free"
          | "pro"
          | "enterprise";
        const plan = getPlanById(planType);

        if (mounted) {
          setSubscriptionData({
            subscription: subscription || null,
            plan,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        if (mounted) {
          setSubscriptionData({
            subscription: null,
            plan: getPlanById("free"),
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    }

    fetchSubscription();

    // Listen for auth changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      if (mounted) {
        fetchSubscription();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return subscriptionData;
}
