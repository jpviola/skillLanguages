// Layer 3 — POST /api/v1/plan : generate a new learning plan via the LLM.
import { NextRequest, NextResponse } from "next/server";
import { profileInputSchema } from "@/lib/schema";
import { generateLearningPlan } from "@/lib/llm";
import { rateLimit } from "@/lib/rateLimit";

// Plan generation can take a while — give it headroom (Fluid Compute supports long timeouts).
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const deviceId = req.headers.get("x-device-id") || "anonymous";

  const limited = rateLimit(deviceId);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = profileInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const plan = await generateLearningPlan(parsed.data);
    return NextResponse.json(plan, { status: 201 });
  } catch (err) {
    console.error("[plan] generation failed:", err);
    return NextResponse.json(
      { error: "Our AI is thinking hard. Please try again in a moment." },
      { status: 503 }
    );
  }
}
