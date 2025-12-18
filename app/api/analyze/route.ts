import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { INVESTAnalysisResult } from "@/types/database";
import { checkRateLimit, RATE_LIMITS, getClientIP } from "@/lib/security/rateLimit";
import { validateStoryInput } from "@/lib/security/validation";

async function analyzeWithOpenAI(
  storyText: string,
  acceptanceCriteria?: string
): Promise<INVESTAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const systemPrompt = `You are an expert Business Analyst specializing in user story evaluation using the INVEST criteria. Analyze user stories and provide detailed feedback.

INVEST Criteria:
- Independent: The story can be developed independently without dependencies on other stories
- Negotiable: The story's details can be negotiated and refined
- Valuable: The story delivers value to users or the business
- Estimable: The story can be estimated for effort/complexity
- Small: The story is appropriately sized (not too large)
- Testable: The story has clear acceptance criteria and can be verified

Provide scores from 0-100 for each criterion and specific, actionable feedback.`;

  const userPrompt = `Analyze the following user story against INVEST criteria:

User Story:
${storyText}

${acceptanceCriteria ? `Acceptance Criteria:\n${acceptanceCriteria}` : "No acceptance criteria provided."}

Provide a JSON response with this exact structure:
{
  "independent": { "score": 0-100, "feedback": "detailed feedback" },
  "negotiable": { "score": 0-100, "feedback": "detailed feedback" },
  "valuable": { "score": 0-100, "feedback": "detailed feedback" },
  "estimable": { "score": 0-100, "feedback": "detailed feedback" },
  "small": { "score": 0-100, "feedback": "detailed feedback" },
  "testable": { "score": 0-100, "feedback": "detailed feedback" },
  "overall_score": 0-100,
  "recommendations": ["suggestion1", "suggestion2", ...]
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response content from OpenAI");
  }

  try {
    const analysis = JSON.parse(content) as INVESTAnalysisResult;
    
    // Validate the structure
    if (
      !analysis.independent ||
      !analysis.negotiable ||
      !analysis.valuable ||
      !analysis.estimable ||
      !analysis.small ||
      !analysis.testable
    ) {
      throw new Error("Invalid analysis structure");
    }

    return analysis;
  } catch (parseError) {
    console.error("Error parsing AI response:", parseError);
    throw new Error("Failed to parse AI analysis response");
  }
}

async function analyzeWithAnthropic(
  storyText: string,
  acceptanceCriteria?: string
): Promise<INVESTAnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Anthropic API key not configured");
  }

  const systemPrompt = `You are an expert Business Analyst specializing in user story evaluation using the INVEST criteria. Analyze user stories and provide detailed feedback.

INVEST Criteria:
- Independent: The story can be developed independently without dependencies on other stories
- Negotiable: The story's details can be negotiated and refined
- Valuable: The story delivers value to users or the business
- Estimable: The story can be estimated for effort/complexity
- Small: The story is appropriately sized (not too large)
- Testable: The story has clear acceptance criteria and can be verified

Provide scores from 0-100 for each criterion and specific, actionable feedback. Return ONLY valid JSON.`;

  const userPrompt = `Analyze the following user story against INVEST criteria:

User Story:
${storyText}

${acceptanceCriteria ? `Acceptance Criteria:\n${acceptanceCriteria}` : "No acceptance criteria provided."}

Provide a JSON response with this exact structure:
{
  "independent": { "score": 0-100, "feedback": "detailed feedback" },
  "negotiable": { "score": 0-100, "feedback": "detailed feedback" },
  "valuable": { "score": 0-100, "feedback": "detailed feedback" },
  "estimable": { "score": 0-100, "feedback": "detailed feedback" },
  "small": { "score": 0-100, "feedback": "detailed feedback" },
  "testable": { "score": 0-100, "feedback": "detailed feedback" },
  "overall_score": 0-100,
  "recommendations": ["suggestion1", "suggestion2", ...]
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${error}`);
  }

  const data = await response.json();
  const content = data.content[0]?.text;

  if (!content) {
    throw new Error("No response content from Anthropic");
  }

  try {
    // Extract JSON from response (Claude might wrap it in markdown)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonContent = jsonMatch ? jsonMatch[0] : content;
    const analysis = JSON.parse(jsonContent) as INVESTAnalysisResult;

    // Validate the structure
    if (
      !analysis.independent ||
      !analysis.negotiable ||
      !analysis.valuable ||
      !analysis.estimable ||
      !analysis.small ||
      !analysis.testable
    ) {
      throw new Error("Invalid analysis structure");
    }

    return analysis;
  } catch (parseError) {
    console.error("Error parsing AI response:", parseError);
    throw new Error("Failed to parse AI analysis response");
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Rate limiting (per user)
    const rateLimit = checkRateLimit(`user:${user.id}`, RATE_LIMITS.analyze);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `You've exceeded the limit of ${RATE_LIMITS.analyze.maxRequests} analyses per hour. Please wait ${rateLimit.retryAfter} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
            "X-RateLimit-Limit": String(RATE_LIMITS.analyze.maxRequests),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.resetTime),
          },
        }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validateStoryInput({
      title: body.title || "Untitled Story",
      storyText: body.storyText,
      acceptanceCriteria: body.acceptanceCriteria,
    });

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: "Invalid input", message: validation.error },
        { status: 400 }
      );
    }

    const { storyText, acceptanceCriteria } = validation.data;

    // Determine which AI provider to use
    // Check if keys are actually set (not just present but empty)
    const hasAnthropicKey = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim().length > 0;
    const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0;
    
    let analysis: INVESTAnalysisResult;
    
    try {
      // Try Anthropic first if configured, otherwise use OpenAI
      if (hasAnthropicKey) {
        try {
          analysis = await analyzeWithAnthropic(storyText, acceptanceCriteria);
        } catch (anthropicError) {
          console.error("Anthropic API error:", anthropicError);
          
          // If Anthropic fails and OpenAI is available, try OpenAI as fallback
          if (hasOpenAIKey) {
            console.log("Anthropic failed, falling back to OpenAI...");
            try {
              analysis = await analyzeWithOpenAI(storyText, acceptanceCriteria);
            } catch (openAIError) {
              console.error("OpenAI API error:", openAIError);
              // Throw the original Anthropic error with context
              throw new Error(`Anthropic API failed: ${anthropicError instanceof Error ? anthropicError.message : String(anthropicError)}. OpenAI fallback also failed: ${openAIError instanceof Error ? openAIError.message : String(openAIError)}`);
            }
          } else {
            throw anthropicError; // No fallback available
          }
        }
      } else if (hasOpenAIKey) {
        // Use OpenAI if Anthropic is not configured
        analysis = await analyzeWithOpenAI(storyText, acceptanceCriteria);
      } else {
        return NextResponse.json(
          { 
            error: "No AI API key configured",
            message: "Please configure either ANTHROPIC_API_KEY or OPENAI_API_KEY in your .env.local file. Make sure the key is not empty."
          },
          { status: 500 }
        );
      }
    } catch (aiError) {
      console.error("AI analysis error:", aiError);
      const errorMessage = aiError instanceof Error ? aiError.message : "Failed to analyze story";
      
      // Provide more helpful error messages
      if (errorMessage.includes("invalid x-api-key") || errorMessage.includes("authentication_error")) {
        return NextResponse.json(
          {
            error: "Invalid API Key",
            message: "The Anthropic API key is invalid or not properly configured. Please check your ANTHROPIC_API_KEY in .env.local and ensure it starts with 'sk-ant-'.",
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        {
          error: "Analysis failed",
          message: errorMessage,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in analyze route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

