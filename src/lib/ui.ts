// Layer 2 — Shared UI mappings (color-coding from the design system).
import type { TopicType, Cost, WeekStatus } from "./types";

export const topicTypeStyles: Record<TopicType, string> = {
  Vocabulary: "bg-indigo-50 text-indigo-600 border-indigo-200",
  Grammar: "bg-blue-50 text-blue-600 border-blue-200",
  Listening: "bg-sky-50 text-sky-600 border-sky-200",
  Speaking: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Reading: "bg-amber-50 text-amber-600 border-amber-200",
  Writing: "bg-orange-50 text-orange-600 border-orange-200",
  Pronunciation: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200",
  Culture: "bg-teal-50 text-teal-600 border-teal-200",
  Review: "bg-slate-100 text-slate-600 border-slate-200",
  Assessment: "bg-rose-50 text-rose-600 border-rose-200",
};

export const costStyles: Record<Cost, string> = {
  Free: "bg-emerald-50 text-emerald-700",
  Low: "bg-amber-50 text-amber-700",
  Premium: "bg-red-50 text-red-700",
};

export const statusBorder: Record<WeekStatus, string> = {
  completed: "border-l-emerald-500",
  in_progress: "border-l-amber-500",
  not_started: "border-l-indigo-500",
};

export const statusLabel: Record<WeekStatus, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  not_started: "Not Started",
};

export function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `~${h} hr`;
  return `~${h} hr ${m} min`;
}
