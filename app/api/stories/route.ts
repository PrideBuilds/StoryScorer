import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createStory, getStories } from "@/lib/db/stories";
import { checkRateLimit, RATE_LIMITS } from "@/lib/security/rateLimit";
import { validateStoryInput } from "@/lib/security/validation";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(`user:${user.id}`, RATE_LIMITS.stories);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many requests. Please wait ${rateLimit.retryAfter} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const {
      title,
      story_text,
      acceptance_criteria,
      tags,
      score,
      analysis_result,
    } = body;

    // Validate input using validation utility
    const validation = validateStoryInput({
      title,
      storyText: story_text,
      acceptanceCriteria: acceptance_criteria,
    });

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: "Invalid input", message: validation.error },
        { status: 400 }
      );
    }

    const { data, error } = await createStory({
      title: validation.data.title,
      story_text: validation.data.storyText,
      acceptance_criteria: validation.data.acceptanceCriteria || null,
      tags: Array.isArray(tags) && tags.length > 0 ? tags.slice(0, 10) : null, // Limit to 10 tags
      score:
        typeof score === "number" && score >= 0 && score <= 100 ? score : null,
      analysis_result: analysis_result || null,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(`user:${user.id}`, RATE_LIMITS.stories);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many requests. Please wait ${rateLimit.retryAfter} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        }
      );
    }

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "20"))
    );
    const search = searchParams.get("search")?.slice(0, 100) || undefined; // Limit search length
    const sortBy = (searchParams.get("sortBy") || "created_at") as
      | "created_at"
      | "score"
      | "title";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";

    // Validate sortBy and sortOrder
    if (!["created_at", "score", "title"].includes(sortBy)) {
      return NextResponse.json(
        { error: "Invalid sortBy parameter" },
        { status: 400 }
      );
    }

    if (!["asc", "desc"].includes(sortOrder)) {
      return NextResponse.json(
        { error: "Invalid sortOrder parameter" },
        { status: 400 }
      );
    }

    const { data, count, error } = await getStories({
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    const response = NextResponse.json(
      {
        data,
        pagination: {
          page,
          pageSize,
          total: count,
          totalPages: Math.ceil(count / pageSize),
        },
      },
      { status: 200 }
    );

    // Add caching headers for GET requests (stale-while-revalidate)
    response.headers.set(
      "Cache-Control",
      "private, s-maxage=60, stale-while-revalidate=300"
    );

    return response;
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
