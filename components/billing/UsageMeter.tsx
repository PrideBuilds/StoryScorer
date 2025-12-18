"use client";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface UsageMeterProps {
  current: number;
  limit: number | "unlimited";
  planType: string;
}

export function UsageMeter({ current, limit, planType }: UsageMeterProps) {
  if (limit === "unlimited") {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Analyses Used</span>
          <span className="text-sm text-muted-foreground">Unlimited</span>
        </div>
        <div className="text-2xl font-bold mb-1">{current}</div>
        <p className="text-sm text-muted-foreground">
          You have unlimited analyses with your {planType} plan
        </p>
      </div>
    );
  }

  const percentage = Math.min((current / limit) * 100, 100);
  const remaining = Math.max(limit - current, 0);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Analyses Used</span>
          <span className="text-sm text-muted-foreground">
            {current} / {limit}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {remaining} remaining this month
          </span>
          <span
            className={`text-xs font-medium ${
              isAtLimit
                ? "text-red-600"
                : isNearLimit
                  ? "text-yellow-600"
                  : "text-green-600"
            }`}
          >
            {percentage.toFixed(0)}% used
          </span>
        </div>
      </div>

      {isNearLimit && !isAtLimit && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You're approaching your monthly limit.{" "}
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link href="/pricing">Upgrade your plan</Link>
            </Button>{" "}
            to continue analyzing stories.
          </AlertDescription>
        </Alert>
      )}

      {isAtLimit && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You've reached your monthly limit.{" "}
            <Button variant="link" className="p-0 h-auto text-inherit" asChild>
              <Link href="/pricing">Upgrade your plan</Link>
            </Button>{" "}
            to continue analyzing stories.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
