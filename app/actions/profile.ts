"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "User not authenticated",
    };
  }

  const fullName = formData.get("fullName") as string;
  const company = formData.get("company") as string;
  const jobTitle = formData.get("jobTitle") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      company: company || null,
      job_title: jobTitle || null,
    })
    .eq("id", user.id);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Profile updated successfully",
  };
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "User not authenticated",
    };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      error: "All password fields are required",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      error: "New passwords do not match",
    };
  }

  if (newPassword.length < 8) {
    return {
      error: "Password must be at least 8 characters long",
    };
  }

  // Verify current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return {
      error: "Current password is incorrect",
    };
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return {
      error: updateError.message,
    };
  }

  return {
    success: true,
    message: "Password changed successfully",
  };
}

export async function deleteAccount() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "User not authenticated",
    };
  }

  // Note: Regular users cannot delete their own account via Supabase client
  // This would require admin privileges or a server-side admin function
  // For now, we'll delete the profile and stories, then sign out
  // The user would need to contact support to fully delete the auth account
  
  // Delete all user stories
  const { error: storiesError } = await supabase
    .from("user_stories")
    .delete()
    .eq("user_id", user.id);

  if (storiesError) {
    return {
      error: `Failed to delete stories: ${storiesError.message}`,
    };
  }

  // Delete profile (cascade will handle related data)
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user.id);

  if (profileError) {
    return {
      error: `Failed to delete profile: ${profileError.message}`,
    };
  }

  // Sign out the user
  await supabase.auth.signOut();

  return {
    success: true,
    message: "Account data deleted successfully. Please contact support to fully delete your account.",
  };
}

