// Layer 1 / Layer 3 — LLM service. Uses the AI SDK with the Vercel AI Gateway
// ("provider/model" string), so only AI_GATEWAY_API_KEY is required.
import { generateObject, streamObject, type LanguageModel } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { randomUUID } from "node:crypto";
import { planSchema, adaptationResponseSchema, type PlanSchema, type AdaptationResponse } from "./schema";
import { buildPromptWithFeedback } from "./prompt";
import type { UserProfile, Feedback } from "./types";

export interface WeekSummary {
  week_number: number;
  title: string;
  milestone: string;
}

/**
 * Resolve the LLM to use:
 *  - If MINIMAX_API_KEY is set → call MiniMax directly via its OpenAI-compatible
 *    endpoint. MiniMax doesn't document JSON-schema response_format, but it
 *    supports tool calling; the openai-compatible provider defaults to
 *    tool-mode object generation, which is what we rely on.
 *  - Otherwise → use the Vercel AI Gateway with a "provider/model" string.
 */
function resolveModel(): LanguageModel {
  if (process.env.MINIMAX_API_KEY) {
    const minimax = createOpenAICompatible({
      name: "minimax",
      baseURL: process.env.MINIMAX_BASE_URL || "https://api.minimax.io/v1",
      apiKey: process.env.MINIMAX_API_KEY,
    });
    return minimax(process.env.LLM_MODEL || "MiniMax-M3");
  }
  return process.env.LLM_MODEL || "anthropic/claude-sonnet-4-6";
}

const MODEL = resolveModel();

/** Strip control chars and cap length to keep user text safe inside the prompt. */
function sanitize(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\u0000-\u001F]/g, " ").slice(0, 600).trim();
}

function sanitizeProfile(p: UserProfile): UserProfile {
  return {
    ...p,
    skill: sanitize(p.skill),
    goal: sanitize(p.goal),
    time_available: sanitize(p.time_available),
  };
}

export async function generateLearningPlan(
  rawProfile: UserProfile,
  feedbackHistory: Feedback[] = []
): Promise<PlanSchema> {
  const userProfile = sanitizeProfile(rawProfile);
  const { systemPrompt } = buildPromptWithFeedback(userProfile, feedbackHistory);

  const { object } = await generateObject({
    model: MODEL,
    schema: planSchema,
    system: systemPrompt,
    temperature: 0.3,
    prompt: JSON.stringify({
      ...userProfile,
      feedback_history: feedbackHistory.length > 0 ? feedbackHistory : undefined,
    }),
  });

  // Ensure a stable plan_id even if the model omits/duplicates it.
  if (!object.plan_id || object.plan_id.length < 8) {
    object.plan_id = randomUUID();
  }
  return object;
}

/**
 * Token-efficient adaptation: regenerates ONLY weeks (currentWeek+1 .. totalWeeks)
 * instead of the whole plan, using the completed weeks as continuity context.
 */
export async function adaptRemainingPlan(
  rawProfile: UserProfile,
  feedbackHistory: Feedback[],
  currentWeekNumber: number,
  totalWeeks: number,
  completedWeeks: WeekSummary[]
): Promise<AdaptationResponse> {
  const userProfile = sanitizeProfile(rawProfile);
  const { systemPrompt } = buildPromptWithFeedback(userProfile, feedbackHistory);

  const firstWeek = currentWeekNumber + 1;
  const instruction = `
ADAPTATION TASK: The learner has completed weeks 1..${currentWeekNumber}. Generate ONLY the
remaining weeks numbered ${firstWeek} through ${totalWeeks} (inclusive). Do NOT regenerate the
completed weeks. Keep continuity with what they've already mastered (listed below). Apply the
feedback-driven adaptation rules. Number weeks correctly starting at ${firstWeek}.

ALREADY COMPLETED (for continuity, do not repeat):
${completedWeeks.map((w) => `- Week ${w.week_number}: ${w.title} — ${w.milestone}`).join("\n")}`;

  const { object } = await generateObject({
    model: MODEL,
    schema: adaptationResponseSchema,
    system: systemPrompt + instruction,
    temperature: 0.3,
    prompt: JSON.stringify({ ...userProfile, feedback_history: feedbackHistory }),
  });

  // Defensive: keep only weeks strictly after the current one, in order.
  object.weeks = object.weeks
    .filter((w) => w.week_number > currentWeekNumber)
    .sort((a, b) => a.week_number - b.week_number);
  return object;
}

/**
 * Streaming variant — emits partial objects so the UI can render weeks as they
 * arrive. Returns the streamObject result; the caller turns it into a Response.
 */
export function streamLearningPlan(rawProfile: UserProfile, feedbackHistory: Feedback[] = []) {
  const userProfile = sanitizeProfile(rawProfile);
  const { systemPrompt } = buildPromptWithFeedback(userProfile, feedbackHistory);

  return streamObject({
    model: MODEL,
    schema: planSchema,
    system: systemPrompt,
    temperature: 0.3,
    prompt: JSON.stringify({
      ...userProfile,
      feedback_history: feedbackHistory.length > 0 ? feedbackHistory : undefined,
    }),
  });
}
