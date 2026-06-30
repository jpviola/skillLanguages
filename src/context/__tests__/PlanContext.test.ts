import { describe, it, expect } from "vitest";
import {
  topicKey,
  weekDoneCount,
  weekStatus,
  computeOverallPercent,
  countByStatus,
  nextTopicIndex,
} from "../PlanContext";
import type { Week } from "@/lib/types";

const makeWeek = (n: number, topics: string[]): Week => ({
  week_number: n,
  title: `Week ${n}`,
  objective: `Objective ${n}`,
  topics: topics.map((name) => ({
    name,
    type: "Vocabulary" as const,
    estimated_minutes: 30,
    resources: [],
  })),
  total_time_minutes: topics.length * 30,
  difficulty: "Beginner",
  milestone: `Milestone ${n}`,
});

describe("topicKey", () => {
  it("formats key correctly", () => {
    expect(topicKey(1, 0)).toBe("w1t0");
    expect(topicKey(3, 2)).toBe("w3t2");
    expect(topicKey(10, 5)).toBe("w10t5");
  });
});

describe("weekDoneCount", () => {
  const week = makeWeek(1, ["Topic A", "Topic B", "Topic C"]);

  it("returns 0 when nothing done", () => {
    expect(weekDoneCount(week, {})).toBe(0);
  });

  it("counts only completed topics", () => {
    const tp = { w1t0: true, w1t1: true, w1t2: false };
    expect(weekDoneCount(week, tp)).toBe(2);
  });

  it("returns total when all done", () => {
    const tp = { w1t0: true, w1t1: true, w1t2: true };
    expect(weekDoneCount(week, tp)).toBe(3);
  });

  it("handles week with 0 topics", () => {
    const emptyWeek = makeWeek(1, []);
    expect(weekDoneCount(emptyWeek, {})).toBe(0);
  });
});

describe("weekStatus", () => {
  const week = makeWeek(1, ["A", "B"]);

  it('returns "completed" when all topics done', () => {
    expect(weekStatus(week, { w1t0: true, w1t1: true })).toBe("completed");
  });

  it('returns "in_progress" when some topics done', () => {
    expect(weekStatus(week, { w1t0: true, w1t1: false })).toBe("in_progress");
  });

  it('returns "not_started" when no topics done', () => {
    expect(weekStatus(week, {})).toBe("not_started");
  });

  it('returns "not_started" when week has no topics', () => {
    const emptyWeek = makeWeek(1, []);
    expect(weekStatus(emptyWeek, {})).toBe("not_started");
  });
});

describe("computeOverallPercent", () => {
  const weeks = [makeWeek(1, ["A", "B"]), makeWeek(2, ["C", "D", "E"])];

  it("returns 0 when nothing started", () => {
    expect(computeOverallPercent(weeks, {})).toBe(0);
  });

  it("returns correct percentage with partial progress", () => {
    const tp = { w1t0: true, w1t1: true, w2t0: true };
    // 3 done out of 5 = 60%
    expect(computeOverallPercent(weeks, tp)).toBe(60);
  });

  it("rounds to nearest integer", () => {
    const tp = { w1t0: true }; // 1 out of 5 = 20%
    expect(computeOverallPercent(weeks, tp)).toBe(20);
  });

  it("returns 100 when all complete", () => {
    const tp = { w1t0: true, w1t1: true, w2t0: true, w2t1: true, w2t2: true };
    expect(computeOverallPercent(weeks, tp)).toBe(100);
  });

  it("returns 0 for empty weeks array", () => {
    expect(computeOverallPercent([], {})).toBe(0);
  });
});

describe("countByStatus", () => {
  const weeks = [
    makeWeek(1, ["A"]), // 1 topic
    makeWeek(2, ["B"]), // 1 topic
    makeWeek(3, ["C"]), // 1 topic
    makeWeek(4, ["D"]), // 1 topic
  ];

  it("counts correctly", () => {
    const tp: Record<string, boolean> = {
      w1t0: true, // week 1: 1/1 done → completed
      w2t0: true, // week 2: 1/1 done → completed
      w3t0: false, // week 3: 0/1 done → not_started
      // w4t0: absent → 0/1 done → not_started
    };
    const result = countByStatus(weeks, tp);
    expect(result.completed).toBe(2);
    expect(result.inProgress).toBe(0);
    expect(result.notStarted).toBe(2);
  });

  it("all not_started when empty progress", () => {
    const result = countByStatus(weeks, {});
    expect(result.completed).toBe(0);
    expect(result.inProgress).toBe(0);
    expect(result.notStarted).toBe(4);
  });

  it("all completed when all done", () => {
    const tp: Record<string, boolean> = {
      w1t0: true, w2t0: true, w3t0: true, w4t0: true,
    };
    const result = countByStatus(weeks, tp);
    expect(result.completed).toBe(4);
    expect(result.inProgress).toBe(0);
    expect(result.notStarted).toBe(0);
  });

  it("one in_progress when partially done", () => {
    const tp: Record<string, boolean> = { w1t0: true, w2t0: true };
    const result = countByStatus(weeks, tp);
    expect(result.completed).toBe(2);
    expect(result.inProgress).toBe(0);
    expect(result.notStarted).toBe(2);
  });
});

describe("nextTopicIndex", () => {
  const week = makeWeek(1, ["A", "B", "C"]);

  it("returns 0 when nothing done", () => {
    expect(nextTopicIndex(week, {})).toBe(0);
  });

  it("returns first incomplete index", () => {
    expect(nextTopicIndex(week, { w1t0: true })).toBe(1);
    expect(nextTopicIndex(week, { w1t0: true, w1t1: true })).toBe(2);
  });

  it("returns null when all done", () => {
    expect(nextTopicIndex(week, { w1t0: true, w1t1: true, w1t2: true })).toBe(null);
  });

  it("returns null for empty week", () => {
    const emptyWeek = makeWeek(1, []);
    expect(nextTopicIndex(emptyWeek, {})).toBe(null);
  });
});