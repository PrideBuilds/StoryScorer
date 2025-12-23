// Export client-side Supabase client
export { createClient as createBrowserClient } from "./client";

// Export server-side Supabase clients
export {
  createClient as createServerClient,
  createAdminClient,
} from "./server";

// Export helper functions
export {
  getCurrentUser,
  getCurrentUserServer,
  isAuthenticated,
  isAuthenticatedServer,
  signOut,
} from "./helpers";
