"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function BetaBanner() {
  // Only show in beta environment
  if (process.env.NEXT_PUBLIC_APP_ENV !== "beta") {
    return null;
  }

  return (
    <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950 rounded-none border-x-0 border-t-0">
      <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="text-yellow-800 dark:text-yellow-200 text-sm">
        <strong>Beta Version:</strong> This is a beta environment. All payments
        are in test mode and no real charges will occur. Data may be reset
        during testing.
      </AlertDescription>
    </Alert>
  );
}
