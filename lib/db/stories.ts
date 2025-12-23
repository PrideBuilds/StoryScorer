import { createClient } from "@/lib/supabase/server";
import type {
  UserStory,
  UserStoryInsert,
  UserStoryUpdate,
} from "@/types/database";

/**
 * Create a new user story analysis
 */
export async function createStory(
  storyData: Omit<UserStoryInsert, "user_id">
): Promise<{ data: UserStory | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { data: null, error: "User not authenticated" };
    }

    const insertData: UserStoryInsert = {
      ...storyData,
      user_id: user.id,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (
      supabase.from("user_stories").insert(insertData as any) as any
    )
      .select()
      .single();

    if (error) {
      console.error("Error creating story:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error creating story:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get all stories for the current user with pagination
 */
export async function getStories(options?: {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: "created_at" | "score" | "title";
  sortOrder?: "asc" | "desc";
}): Promise<{
  data: UserStory[] | null;
  count: number;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { data: null, count: 0, error: "User not authenticated" };
    }

    const {
      page = 1,
      pageSize = 20,
      search,
      sortBy = "created_at",
      sortOrder = "desc",
    } = options || {};

    let query = supabase
      .from("user_stories")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range((page - 1) * pageSize, page * pageSize - 1);

    // Add search filter if provided
    if (search) {
      query = query.or(`title.ilike.%${search}%,story_text.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching stories:", error);
      return { data: null, count: 0, error: error.message };
    }

    return { data: data || [], count: count || 0, error: null };
  } catch (error) {
    console.error("Unexpected error fetching stories:", error);
    return {
      data: null,
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get a single story by ID
 */
export async function getStoryById(
  storyId: string
): Promise<{ data: UserStory | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { data: null, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("user_stories")
      .select("*")
      .eq("id", storyId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching story:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error fetching story:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update an existing story
 */
export async function updateStory(
  storyId: string,
  updates: UserStoryUpdate
): Promise<{ data: UserStory | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { data: null, error: "User not authenticated" };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (
      supabase.from("user_stories").update(updates as any) as any
    )
      .eq("id", storyId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating story:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error updating story:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete a story
 */
export async function deleteStory(
  storyId: string
): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "User not authenticated" };
    }

    const { error } = await supabase
      .from("user_stories")
      .delete()
      .eq("id", storyId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting story:", error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error("Unexpected error deleting story:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
