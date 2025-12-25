import { NextRequest, NextResponse } from "next/server";
import { trackUsage } from "@/lib/utils/checkUsageLimit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feature } = body;

    if (!feature) {
      return NextResponse.json(
        { error: "Feature name is required" },
        { status: 400 }
      );
    }

    const result = await trackUsage(feature);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking usage:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
