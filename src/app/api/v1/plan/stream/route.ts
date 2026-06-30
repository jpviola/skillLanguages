// Layer 3 — POST /api/v1/plan/stream : streaming plan generation.
// Emits partial JSON so the client can render weeks as they arrive.
import { NextRequest, NextResponse } from "next/server";
import { profileInputSchema } from "@/lib/schema";
import { streamLearningPlan } from "@/lib/llm";
import { rateLimit } from "@/lib/rateLimit";
import { OUTPUT_LANGUAGE } from "@/lib/api";
import { classifyError, RateLimitError, ValidationError, InvalidBodyError } from "@/lib/errors";

export const maxDuration = 120;

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

  const parsed = profileInputSchema.safeParse(body);
  if (!parsed.success) {
    const err = new ValidationError(parsed.error.flatten().fieldErrors);
    return NextResponse.json(
      { error: err.message, details: (err as unknown as Record<string, unknown>).details },
      { status: err.statusCode }
    );
  }

  const raw = body as { output_language?: string };
  const outputLanguage = raw.output_language && OUTPUT_LANGUAGE[raw.output_language as keyof typeof OUTPUT_LANGUAGE]
    ? OUTPUT_LANGUAGE[raw.output_language as keyof typeof OUTPUT_LANGUAGE]
    : OUTPUT_LANGUAGE.es;

  try {
    const result = streamLearningPlan(parsed.data, [], outputLanguage);
    return result.toTextStreamResponse();
  } catch (err) {
    console.error("[plan/stream] generation failed:", err);
    const appErr = classifyError(err);
    return NextResponse.json({ error: appErr.message }, { status: appErr.statusCode });
  }
}