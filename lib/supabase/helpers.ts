import { createClient } from "./client";
import { createClient as createServerClient } from "./server";
import type { Database } from "@/types/database";

// Type aliases for convenience
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

/**
 * Helper function to get the current user from the client-side Supabase client.
 * Use this in Client Components.
 *
 * @returns {Promise<User | null>} The current user or null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching current user:", error);
    return null;
  }

  return user;
}

/**
 * Helper function to get the current user from the server-side Supabase client.
 * Use this in Server Components, Route Handlers, or Server Actions.
 *
 * @returns {Promise<User | null>} The current user or null if not authenticated
 */
export async function getCurrentUserServer() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching current user:", error);
    return null;
  }

  return user;
}

/**
 * Helper function to check if a user is authenticated (client-side).
 *
 * @returns {Promise<boolean>} True if user is authenticated, false otherwise
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Helper function to check if a user is authenticated (server-side).
 *
 * @returns {Promise<boolean>} True if user is authenticated, false otherwise
 */
export async function isAuthenticatedServer() {
  const user = await getCurrentUserServer();
  return user !== null;
}

/**
 * Helper function to sign out the current user (client-side).
 *
 * @returns {Promise<{ error: Error | null }>} Error object if sign out failed
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    return { error };
  }

  return { error: null };
}

/**
 * Helper function to get user profile with proper typing (server-side).
 * This replaces the need for type assertions like `as Profile | null`.
 *
 * @param userId - The user ID to fetch the profile for
 * @returns {Promise<{ data: Profile | null; error: string | null }>}
 */
export async function getUserProfile(
  userId: string
): Promise<{ data: Profile | null; error: string | null }> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return { data: null, error: error.message };
  }

  return { data: data as Profile, error: null };
}

/**
 * Helper function to get user subscription with proper typing (server-side).
 * This replaces the need for type assertions like `as Subscription | null`.
 *
 * @param userId - The user ID to fetch the subscription for
 * @returns {Promise<{ data: Subscription | null; error: string | null }>}
 */
export async function getUserSubscription(
  userId: string
): Promise<{ data: Subscription | null; error: string | null }> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    // Not found is not necessarily an error - user might not have a subscription yet
    if (error.code === "PGRST116") {
      return { data: null, error: null };
    }
    console.error("Error fetching user subscription:", error);
    return { data: null, error: error.message };
  }

  return { data: data as Subscription, error: null };
}

/**
 * Helper function to update user profile with proper typing (server-side).
 * This replaces the need for supabaseAny workarounds.
 *
 * @param userId - The user ID to update
 * @param updates - The profile fields to update
 * @returns {Promise<{ data: Profile | null; error: string | null }>}
 */
export async function updateUserProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<{ data: Profile | null; error: string | null }> {
  const supabase = await createServerClient();

  // Type assertion needed due to Supabase SDK's update method type inference limitations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    return { data: null, error: error.message };
  }

  return { data: data as Profile, error: null };
}
