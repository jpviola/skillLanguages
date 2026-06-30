import { describe, it, expect } from "vitest";
import {
  planSchema,
  profileInputSchema,
  feedbackInputSchema,
  feedbackRequestSchema,
  adaptationResponseSchema,
  placementResponseSchema,
  resourceSchema,
  weekSchema,
} from "../schema";

describe("resourceSchema", () => {
  it("accepts valid resource", () => {
    const r = { title: "Anki", url: "https://ankiweb.net", type: "App", cost: "Free", preferred: true };
    expect(resourceSchema.safeParse(r).success).toBe(true);
  });

  it("rejects invalid type", () => {
    const r = { title: "Test", url: "", type: "Videooo", cost: "Free", preferred: false };
    expect(resourceSchema.safeParse(r).success).toBe(false);
  });

  it("rejects invalid cost", () => {
    const r = { title: "Test", url: "", type: "Video", cost: "Expensive", preferred: false };
    expect(resourceSchema.safeParse(r).success).toBe(false);
  });

  it("accepts empty url", () => {
    const r = { title: "Test", url: "", type: "Video", cost: "Free", preferred: false };
    expect(resourceSchema.safeParse(r).success).toBe(true);
  });
});

describe("weekSchema", () => {
  it("accepts valid week with topics", () => {
    const w = {
      week_number: 1,
      title: "Intro",
      objective: "Say hello",
      topics: [
        { name: "Greetings", type: "Speaking", estimated_minutes: 30, resources: [] },
        { name: "Alphabet", type: "Vocabulary", estimated_minutes: 30, resources: [] },
      ],
      total_time_minutes: 60,
      difficulty: "Beginner",
      milestone: "Can greet people",
    };
    expect(weekSchema.safeParse(w).success).toBe(true);
  });
  // Note: week topic count (3-5) and week total (8-16) are enforced by the
  // prompt instructions to the LLM, not by the Zod schema.
});

describe("planSchema", () => {
  it("accepts valid plan with weeks", () => {
    const weeks = Array.from({ length: 8 }, (_, i) => ({
      week_number: i + 1,
      title: `Week ${i + 1}`,
      objective: "Objective",
      topics: [
        { name: "Topic", type: "Vocabulary" as const, estimated_minutes: 30, resources: [] },
      ],
      total_time_minutes: 30,
      difficulty: "Beginner" as const,
      milestone: "Done",
    }));
    const plan = {
      plan_id: "abc-123",
      skill: "Spanish",
      total_weeks: 8,
      weekly_time_hours: 6,
      weeks,
      estimated_total_cost: "$0",
      adaptation_note: "",
    };
    expect(planSchema.safeParse(plan).success).toBe(true);
  });
  // Note: 8-16 week requirement and 3-5 topics/week are enforced by the
  // prompt, not by the Zod schema.
});

describe("profileInputSchema", () => {
  const valid = {
    skill: "Spanish",
    current_level: "A1",
    goal: "Learn Spanish in 3 months",
    time_available: "5-7 hours/week",
    learning_style: ["Conversation", "Listening"],
    resource_preference: "Free only",
  };

  it("accepts valid profile", () => {
    expect(profileInputSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty skill", () => {
    const p = { ...valid, skill: "" };
    expect(profileInputSchema.safeParse(p).success).toBe(false);
  });

  it("rejects invalid CEFR level", () => {
    const p = { ...valid, current_level: "BEGINNER" as never };
    expect(profileInputSchema.safeParse(p).success).toBe(false);
  });

  it("rejects empty learning_style array", () => {
    const p = { ...valid, learning_style: [] };
    expect(profileInputSchema.safeParse(p).success).toBe(false);
  });

  it("rejects goal longer than 600 chars", () => {
    const p = { ...valid, goal: "x".repeat(601) };
    expect(profileInputSchema.safeParse(p).success).toBe(false);
  });
});

describe("feedbackInputSchema", () => {
  it("accepts valid feedback", () => {
    const f = { week_number: 1, difficulty: "Just Right", comment: "Good", completed: true };
    expect(feedbackInputSchema.safeParse(f).success).toBe(true);
  });

  it("defaults comment to empty string", () => {
    const result = feedbackInputSchema.safeParse({ week_number: 1, difficulty: "Too Hard" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.comment).toBe("");
  });

  it("defaults completed to false", () => {
    const result = feedbackInputSchema.safeParse({ week_number: 1, difficulty: "Too Easy" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.completed).toBe(false);
  });

  it("rejects comment longer than 600 chars", () => {
    const f = { week_number: 1, difficulty: "Too Hard", comment: "x".repeat(601), completed: false };
    expect(feedbackInputSchema.safeParse(f).success).toBe(false);
  });
});

describe("feedbackRequestSchema", () => {
  const base = {
    skill: "Spanish",
    current_level: "A1" as const,
    goal: "Learn Spanish",
    time_available: "5 hours",
    learning_style: ["Conversation"] as const[],
    resource_preference: "Free only" as const,
  };

  it("accepts valid feedback request", () => {
    const req = {
      profile: base,
      feedback_history: [{ week_number: 1, difficulty: "Just Right" as const, comment: "", completed: true }],
      current_week_number: 1,
      total_weeks: 8,
      completed_weeks: [],
    };
    expect(feedbackRequestSchema.safeParse(req).success).toBe(true);
  });

  it("rejects empty feedback_history", () => {
    const req = {
      profile: base,
      feedback_history: [],
      current_week_number: 1,
      total_weeks: 8,
      completed_weeks: [],
    };
    expect(feedbackRequestSchema.safeParse(req).success).toBe(false);
  });

  it("rejects negative current_week_number", () => {
    const req = {
      profile: base,
      feedback_history: [{ week_number: 1, difficulty: "Just Right" as const, comment: "", completed: true }],
      current_week_number: -1,
      total_weeks: 8,
      completed_weeks: [],
    };
    expect(feedbackRequestSchema.safeParse(req).success).toBe(false);
  });
});

describe("adaptationResponseSchema", () => {
  it("accepts valid adaptation response", () => {
    const a = {
      weeks: [{
        week_number: 2,
        title: "Week 2",
        objective: "Continue",
        topics: [{ name: "T", type: "Vocabulary" as const, estimated_minutes: 30, resources: [] }],
        total_time_minutes: 30,
        difficulty: "Beginner" as const,
        milestone: "Done",
      }],
      adaptation_note: "Adjusted for feedback",
    };
    expect(adaptationResponseSchema.safeParse(a).success).toBe(true);
  });
  // Note: minimum 1 week is a prompt requirement, not enforced by schema.
});

describe("placementResponseSchema", () => {
  it("accepts valid placement test", () => {
    const p = {
      questions: [
        {
          level: "A1" as const,
          question: "How do you say 'hello' in Spanish?",
          options: ["Hola", "Adiós", "Gracias", "Por favor"],
          answer_index: 0,
        },
      ],
    };
    expect(placementResponseSchema.safeParse(p).success).toBe(true);
  });

  it("rejects question with wrong answer_index range", () => {
    const p = {
      questions: [
        {
          level: "A1" as const,
          question: "Test?",
          options: ["A", "B", "C", "D"],
          answer_index: 5,
        },
      ],
    };
    expect(placementResponseSchema.safeParse(p).success).toBe(false);
  });
});