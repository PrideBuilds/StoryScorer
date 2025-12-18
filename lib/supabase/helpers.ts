import { createClient } from "./client";
import { createClient as createServerClient } from "./server";

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

