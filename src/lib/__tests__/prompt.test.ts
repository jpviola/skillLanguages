import { describe, it, expect } from "vitest";
import { buildPromptWithFeedback, outputLanguageInstruction, BASE_SYSTEM_PROMPT } from "../prompt";
import type { UserProfile, Feedback } from "../types";

const defaultProfile: UserProfile = {
  skill: "Spanish",
  current_level: "A1",
  goal: "Learn Spanish in 3 months",
  time_available: "6-7 hours/week",
  learning_style: ["Conversation", "Listening"],
  resource_preference: "Free + Low cost",
};

describe("outputLanguageInstruction", () => {
  it("returns instruction string containing the language name", () => {
    const result = outputLanguageInstruction("Spanish");
    expect(result).toContain("Spanish");
  });

  it("keeps enum values in English", () => {
    const result = outputLanguageInstruction("Spanish");
    expect(result).toContain("type");
    expect(result).not.toContain("Tipo");
  });
});

describe("buildPromptWithFeedback — no feedback", () => {
  it("returns base system prompt with output language instruction", () => {
    const { systemPrompt } = buildPromptWithFeedback(defaultProfile, [], "Spanish");
    expect(systemPrompt).toContain(BASE_SYSTEM_PROMPT);
    expect(systemPrompt).toContain("Write ALL human-readable text in Spanish");
  });

  it("uses English output language when specified", () => {
    const { systemPrompt } = buildPromptWithFeedback(defaultProfile, [], "English");
    expect(systemPrompt).toContain("Write ALL human-readable text in English");
  });
});

describe("buildPromptWithFeedback — Too Hard feedback", () => {
  const feedback: Feedback = {
    week_number: 2,
    difficulty: "Too Hard",
    comment: "Grammar was overwhelming",
    completed: true,
  };

  it("includes reduction instructions for Too Hard", () => {
    const { systemPrompt } = buildPromptWithFeedback(defaultProfile, [feedback], "Spanish");
    expect(systemPrompt).toContain("too hard");
    expect(systemPrompt).toContain("Reduce the pace");
    expect(systemPrompt).toContain("Week 3");
  });

  it("incorporates user comment directly", () => {
    const { systemPrompt } = buildPromptWithFeedback(defaultProfile, [feedback], "Spanish");
    expect(systemPrompt).toContain("Grammar was overwhelming");
  });

  it("includes adaptation_note requirement", () => {
    const { systemPrompt } = buildPromptWithFeedback(defaultProfile, [feedback], "Spanish");
    expect(systemPrompt).toContain("adaptation_note");
  });
});

describe("buildPromptWithFeedback — Too Easy feedback", () => {
  const feedback: Feedback = {
    week_number: 3,
    difficulty: "Too Easy",
    comment: "",
    completed: true,
  };

  it("includes acceleration instructions for Too Easy", () => {
    const { systemPrompt } = buildPromptWithFeedback(defaultProfile, [feedback], "Spanish");
    expect(systemPrompt).toContain("too easy");
    expect(systemPrompt).toContain("Increase the pace");
    expect(systemPrompt).toContain("Week 4");
  });

  it("does not mention user comment when comment is empty", () => {
    const { systemPrompt } = buildPromptWithFeedback(defaultProfile, [feedback], "Spanish");
    expect(systemPrompt).not.toContain('The user also said: ""');
  });
});

describe("buildPromptWithFeedback — Just Right feedback", () => {
  const feedback: Feedback = {
    week_number: 1,
    difficulty: "Just Right",
    comment: "",
    completed: true,
  };

  it("does not add adaptation block for Just Right without comment", () => {
    const { systemPrompt } = buildPromptWithFeedback(defaultProfile, [feedback], "Spanish");
    expect(systemPrompt).not.toContain("IMPORTANT: The user found Week");
  });
});

describe("buildPromptWithFeedback — multiple feedback entries", () => {
  it("uses only the most recent feedback for adaptation", () => {
    const oldFeedback: Feedback = {
      week_number: 1,
      difficulty: "Too Easy",
      comment: "Old comment",
      completed: true,
    };
    const recentFeedback: Feedback = {
      week_number: 2,
      difficulty: "Too Hard",
      comment: "New issue",
      completed: true,
    };

    const { systemPrompt } = buildPromptWithFeedback(defaultProfile, [oldFeedback, recentFeedback], "Spanish");
    expect(systemPrompt).toContain("Week 2 too hard");
    expect(systemPrompt).not.toContain("Week 1 too easy");
    expect(systemPrompt).toContain("New issue");
  });
});

describe("BASE_SYSTEM_PROMPT rules", () => {
  it("enforces Week 1 orientation rule", () => {
    expect(BASE_SYSTEM_PROMPT).toContain("Week 1 MUST begin with orientation");
  });

  it("enforces 8-16 week requirement", () => {
    expect(BASE_SYSTEM_PROMPT).toContain("between 8 and 16 full weeks");
  });

  it("enforces 3-5 topics per week", () => {
    expect(BASE_SYSTEM_PROMPT).toContain("3 to 5 topics");
  });

  it("enforces 50% active practice rule", () => {
    expect(BASE_SYSTEM_PROMPT).toContain("At least 50% of weekly topics must be active practice");
  });

  it("maps classical vs living languages correctly", () => {
    expect(BASE_SYSTEM_PROMPT).toContain("classical languages (Latin, Ancient Greek)");
    expect(BASE_SYSTEM_PROMPT).toContain("living languages (Spanish, English, French, Italian)");
  });
});