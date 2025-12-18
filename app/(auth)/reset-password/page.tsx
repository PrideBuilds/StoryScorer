"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { updatePasswordSchema, type UpdatePasswordInput } from "@/lib/validations/auth";
import { updatePassword } from "@/app/actions/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
  });

  useEffect(() => {
    // Check for error parameter from callback route
    const errorParam = searchParams.get("error");
    
    if (errorParam === "invalid_token") {
      setError("Invalid or expired reset link. Please request a new password reset.");
      setIsCheckingSession(false);
      return;
    }

    // Verify session exists
    const verifySession = async () => {
      const supabase = createClient();
      
      // Check if we have a valid session
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        // No session - check if there's a hash parameter we need to process
        const hash = searchParams.get("hash");
        
        if (hash) {
          // Hash is present but session not created yet
          // Supabase should process the hash automatically, wait a moment
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Check again after waiting
          const {
            data: { user: retryUser },
          } = await supabase.auth.getUser();
          
          if (!retryUser) {
            setError("Invalid or expired reset link. Please request a new password reset.");
          }
        } else {
          // No hash and no session - invalid
          setError("Invalid or expired reset link. Please request a new password reset.");
        }
      }
      
      setIsCheckingSession(false);
    };

    verifySession();
  }, [searchParams]);

  const onSubmit = async (data: UpdatePasswordInput) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    const result = await updatePassword(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  if (isCheckingSession) {
    return (
      <AuthCard title="Verifying reset link..." description="Please wait">
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </AuthCard>
    );
  }

  if (success) {
    return (
      <AuthCard
        title="Password updated"
        description="Your password has been successfully updated"
      >
        <Alert className="mb-4">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Your password has been updated. Redirecting to login...
          </AlertDescription>
        </Alert>
        <Button asChild className="w-full">
          <a href="/login">Go to login</a>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set new password"
      description="Enter your new password below"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update password"
          )}
        </Button>

        {error && error.includes("Invalid or expired") && (
          <div className="text-center text-sm mt-4">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Request a new password reset
            </Link>
          </div>
        )}
      </form>
    </AuthCard>
  );
}

