// Layer 3 — POST /api/v1/placement : generate a CEFR placement test for a language.
import { NextRequest, NextResponse } from "next/server";
import { placementRequestSchema } from "@/lib/schema";
import { generatePlacementTest } from "@/lib/llm";
import { rateLimit } from "@/lib/rateLimit";
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

  const parsed = placementRequestSchema.safeParse(body);
  if (!parsed.success) {
    const err = new ValidationError(parsed.error.flatten().fieldErrors);
    return NextResponse.json(
      { error: err.message, details: (err as unknown as Record<string, unknown>).details },
      { status: err.statusCode }
    );
  }

  try {
    const test = await generatePlacementTest(parsed.data.language);
    return NextResponse.json(test, { status: 200 });
  } catch (err) {
    console.error("[placement] generation failed:", err);
    const appErr = classifyError(err);
    return NextResponse.json({ error: appErr.message }, { status: appErr.statusCode });
  }
}