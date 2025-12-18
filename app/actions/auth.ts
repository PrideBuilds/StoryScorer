"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email/send";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password || !fullName) {
    return {
      error: "All fields are required",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return {
        error:
          "An account with this email already exists. Please sign in instead.",
      };
    }
    return {
      error: error.message,
    };
  }

  if (data.user) {
    // Send welcome email (don't await to avoid blocking redirect)
    sendWelcomeEmail({
      userName: fullName,
      userEmail: email,
    }).catch((error) => {
      console.error("Failed to send welcome email:", error);
      // Don't fail signup if email fails
    });

    revalidatePath("/", "layout");
    redirect("/verify-email");
  }

  return {
    error: null,
  };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Email and password are required",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return {
        error: "Invalid email or password. Please try again.",
      };
    }
    if (error.message.includes("Email not confirmed")) {
      return {
        error: "Please verify your email before signing in.",
      };
    }
    return {
      error: error.message,
    };
  }

  if (data.user) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    error: null,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email) {
    return {
      error: "Email is required",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectTo = `${siteUrl}/reset-password`;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo,
  });

  if (error) {
    console.error("Password reset error:", error);
    return {
      error:
        error.message ||
        "Failed to send password reset email. Please try again.",
    };
  }

  // Note: Supabase sends its own password reset email, but we can also send our custom one
  // The reset link will be in the Supabase email, so we'll rely on that for now
  // In production, you might want to customize the Supabase email template instead

  // Note: Supabase doesn't return data on success, but if no error, email was sent
  return {
    success: true,
    message: "Password reset email sent. Please check your inbox.",
  };
}

export async function verifySession() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      hasSession: false,
      error: error?.message || "No active session",
    };
  }

  return {
    hasSession: true,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  // Check if user has a valid session (required for password reset)
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return {
      error:
        "Invalid or expired reset link. Please request a new password reset.",
    };
  }

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return {
      error: "Password fields are required",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match",
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters long",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  return {
    success: true,
    message: "Password updated successfully",
  };
}

export async function resendVerificationEmail(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email) {
    return {
      error: "Email is required",
    };
  }

  // Supabase doesn't have a direct resend verification email method
  // We'll use resetPasswordForEmail as a workaround or signUp again
  // For now, we'll return an error suggesting the user to sign up again
  return {
    error:
      "Please use the sign-up form again to resend the verification email.",
  };
}
