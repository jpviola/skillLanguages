// Layer 3 — POST /api/v1/plan/feedback : adapt the plan based on feedback.
// MVP (no DB): client sends profile + full feedback history + current week.
// Server regenerates with adaptation logic and returns the remaining weeks.
import { NextRequest, NextResponse } from "next/server";
import { feedbackRequestSchema } from "@/lib/schema";
import { adaptRemainingPlan } from "@/lib/llm";
import { rateLimit } from "@/lib/rateLimit";
import { OUTPUT_LANGUAGE } from "@/lib/api";
import { classifyError, RateLimitError, ValidationError, InvalidBodyError } from "@/lib/errors";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const deviceId = req.headers.get("x-device-id") || "anonymous";

  const limited = await rateLimit(deviceId);
  if (!limited.ok) {
    const err = new RateLimitError(limited.retryAfter);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode, headers: { "Retry-After": String(err.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    const err = new InvalidBodyError();
    return NextResponse.json({ error: err.message }, { status: err.statusCode });
  }

  const parsed = feedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    const err = new ValidationError(parsed.error.flatten().fieldErrors);
    return NextResponse.json(
      { error: err.message, details: (err as unknown as Record<string, unknown>).details },
      { status: err.statusCode }
    );
  }

  const { profile, feedback_history, current_week_number, total_weeks, completed_weeks } =
    parsed.data;
  const raw = body as { output_language?: string };
  const outputLanguage = raw.output_language && OUTPUT_LANGUAGE[raw.output_language as keyof typeof OUTPUT_LANGUAGE]
    ? OUTPUT_LANGUAGE[raw.output_language as keyof typeof OUTPUT_LANGUAGE]
    : OUTPUT_LANGUAGE.es;

  try {
    const result = await adaptRemainingPlan(
      profile,
      feedback_history,
      current_week_number,
      total_weeks,
      completed_weeks,
      outputLanguage
    );
    return NextResponse.json(
      {
        adapted: true,
        updated_weeks: result.weeks,
        adaptation_note: result.adaptation_note,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[feedback] adaptation failed:", err);
    const appErr = classifyError(err);
    return NextResponse.json({ error: appErr.message }, { status: appErr.statusCode });
  }
}