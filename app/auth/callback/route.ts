import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const hash = requestUrl.searchParams.get("hash");
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  const type = requestUrl.searchParams.get("type");

  const supabase = await createClient();

  // Handle password reset with hash parameter
  if (hash) {
    // For password reset, we need to verify the hash creates a valid session
    // Supabase processes the hash automatically when the URL is accessed
    // We'll redirect to reset password page with the hash so Supabase can process it
    // The reset password page will verify the session exists
    return NextResponse.redirect(
      new URL(`/reset-password?hash=${hash}&type=recovery`, request.url)
    );
  }

  // Handle email verification with code parameter
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If this is a password recovery, redirect to reset password page
      if (type === "recovery") {
        return NextResponse.redirect(
          new URL("/reset-password?type=recovery", request.url)
        );
      }
      // Otherwise redirect to the dashboard or the next parameter
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // If there's an error or no code/hash, redirect to login
  return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
}

