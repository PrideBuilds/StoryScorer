"use client";

import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle2 } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <AuthCard
      title="Verify your email"
      description="We've sent you a verification link"
    >
      <div className="space-y-4">
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            Please check your email inbox and click on the verification link to
            activate your account. The link will expire in 24 hours.
          </AlertDescription>
        </Alert>

        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            If you don't see the email, check your spam folder or try signing up
            again.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href="/login">Back to login</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/signup">Sign up again</Link>
          </Button>
        </div>
      </div>
    </AuthCard>
  );
}
