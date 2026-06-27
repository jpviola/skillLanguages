// Layer 1 — Strict zod schema mirroring the OUTPUT JSON SCHEMA.
// Used by generateObject to force structured, valid output from the LLM.
import { z } from "zod";

export const resourceSchema = z.object({
  title: z.string(),
  url: z.string().describe("empty string if unknown"),
  type: z.enum(["Video", "Article", "Interactive", "Practice Guide", "Tool/Equipment"]),
  cost: z.enum(["Free", "Low", "Premium"]),
  preferred: z.boolean().describe("true if best match for the user's preferences"),
});

export const topicSchema = z.object({
  name: z.string(),
  type: z.enum([
    "Safety",
    "Theory",
    "Demonstration",
    "Hands-On Practice",
    "Project",
    "Review",
    "Assessment",
  ]),
  estimated_minutes: z.number().int(),
  resources: z.array(resourceSchema),
});

export const weekSchema = z.object({
  week_number: z.number().int(),
  title: z.string(),
  objective: z.string().describe("one sentence, what the user will achieve"),
  topics: z.array(topicSchema),
  total_time_minutes: z.number().int(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  milestone: z.string().describe("competency gained this week"),
});

export const planSchema = z.object({
  plan_id: z.string().describe("uuid"),
  skill: z.string(),
  total_weeks: z.number().int().describe("8-16 depending on goal"),
  weekly_time_hours: z.number(),
  weeks: z.array(weekSchema),
  estimated_total_cost: z.string().describe('e.g. "$0 (all free resources)"'),
  adaptation_note: z.string().describe("only if feedback was provided: what changed and why"),
});

export type PlanSchema = z.infer<typeof planSchema>;

// ---- Input validation (Layer 3) ----
export const profileInputSchema = z.object({
  skill: z.string().min(1).max(120),
  current_level: z.enum(["Absolute Beginner", "Beginner", "Intermediate", "Advanced"]),
  goal: z.string().min(1).max(600),
  time_available: z.string().min(1).max(60),
  learning_style: z.array(z.enum(["Hands-on", "Videos", "Reading", "Projects"])).min(1),
  resource_preference: z.enum(["Free only", "Free + Low cost", "Any"]),
});

export const feedbackInputSchema = z.object({
  week_number: z.number().int().min(1),
  difficulty: z.enum(["Too Easy", "Just Right", "Too Hard"]),
  comment: z.string().max(600).default(""),
  completed: z.boolean().default(false),
});

// Summary of an already-completed week — given to the model as context so the
// regenerated weeks keep continuity without re-sending full topic data.
export const weekSummarySchema = z.object({
  week_number: z.number().int(),
  title: z.string(),
  milestone: z.string(),
});

export const feedbackRequestSchema = z.object({
  profile: profileInputSchema,
  feedback_history: z.array(feedbackInputSchema).min(1),
  current_week_number: z.number().int().min(1),
  total_weeks: z.number().int().min(1),
  completed_weeks: z.array(weekSummarySchema).default([]),
});

// The model returns ONLY the regenerated remaining weeks (token-efficient).
export const adaptationResponseSchema = z.object({
  weeks: z.array(weekSchema),
  adaptation_note: z.string().describe("what changed for the upcoming weeks and why"),
});

export type AdaptationResponse = z.infer<typeof adaptationResponseSchema>;
