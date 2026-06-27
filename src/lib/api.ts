// Layer 4 — Frontend API client (Fetch, 30s timeout, device id header).
import type { UserProfile, Feedback, Plan, Week } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem("skillpath_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("skillpath_device_id", id);
  }
  return id;
}

async function request<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-Id": getDeviceId(),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Request failed (${res.status})`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export function generatePlan(profile: UserProfile): Promise<Plan> {
  return request<Plan>("/api/v1/plan", profile);
}

export interface AdaptResponse {
  adapted: boolean;
  updated_weeks: Week[];
  adaptation_note: string;
}

export interface WeekSummary {
  week_number: number;
  title: string;
  milestone: string;
}

export function submitFeedback(
  profile: UserProfile,
  feedbackHistory: Feedback[],
  currentWeekNumber: number,
  totalWeeks: number,
  completedWeeks: WeekSummary[]
): Promise<AdaptResponse> {
  return request<AdaptResponse>("/api/v1/plan/feedback", {
    profile,
    feedback_history: feedbackHistory,
    current_week_number: currentWeekNumber,
    total_weeks: totalWeeks,
    completed_weeks: completedWeeks,
  });
}
