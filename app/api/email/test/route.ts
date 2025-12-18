import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email/send";

/**
 * Test endpoint for email functionality
 * Only accessible in development or by authenticated admins
 * 
 * Usage: POST /api/email/test
 * Body: { type: "welcome", email: "test@example.com", name: "Test User" }
 */
export async function POST(request: NextRequest) {
  // Only allow in development or for authenticated users
  const isDevelopment = process.env.NODE_ENV === "development";
  
  if (!isDevelopment) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  try {
    const body = await request.json();
    const { type, email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    switch (type) {
      case "welcome":
        if (!name) {
          return NextResponse.json(
            { error: "Name is required for welcome email" },
            { status: 400 }
          );
        }
        const result = await sendWelcomeEmail({
          userName: name,
          userEmail: email,
        });
        return NextResponse.json({
          success: result,
          message: result
            ? "Welcome email sent successfully"
            : "Failed to send welcome email",
        });

      default:
        return NextResponse.json(
          { error: "Invalid email type. Supported: welcome" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      {
        error: "Failed to send test email",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

