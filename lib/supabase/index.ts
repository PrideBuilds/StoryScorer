// Export client-side Supabase client
export { createClient } from "./client";

// Export server-side Supabase clients
export { createClient, createAdminClient } from "./server";

// Export helper functions
export {
  getCurrentUser,
  getCurrentUserServer,
  isAuthenticated,
  isAuthenticatedServer,
  signOut,
} from "./helpers";

