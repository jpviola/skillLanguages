"use client";
// Layer 4 — Global state via Context + useReducer, persisted to localStorage.
// Progress is tracked at the TOPIC level (the real unit of work); week status
// is derived from it so the UI never shows fake progress.
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react";
import type { UserProfile, Plan, Week, Feedback, WeekStatus, Locale } from "@/lib/types";

interface State {
  locale: Locale;
  isGenerating: boolean;
  isAdapting: boolean;
  userProfile: UserProfile | null;
  plan: Plan | null;
  weeks: Week[];
  topicProgress: Record<string, boolean>; // key: topicKey(weekNumber, topicIndex)
  feedbackHistory: Feedback[];
  expandedWeek: number | null;
  adaptationNote: string | null;
  changedWeeks: number[]; // weeks rewritten by the last adaptation
  showAdaptationBanner: boolean;
  hydrated: boolean;
}

const initialState: State = {
  locale: "es",
  isGenerating: false,
  isAdapting: false,
  userProfile: null,
  plan: null,
  weeks: [],
  topicProgress: {},
  feedbackHistory: [],
  expandedWeek: null,
  adaptationNote: null,
  changedWeeks: [],
  showAdaptationBanner: false,
  hydrated: false,
};

type Action =
  | { type: "HYDRATE"; payload: Partial<State> }
  | { type: "SET_LOCALE"; payload: Locale }
  | { type: "SET_GENERATING"; payload: boolean }
  | { type: "SET_ADAPTING"; payload: boolean }
  | { type: "SET_PROFILE"; payload: UserProfile }
  | { type: "SET_PLAN"; payload: Plan }
  | { type: "TOGGLE_TOPIC"; payload: { weekNumber: number; topicIndex: number } }
  | { type: "SET_WEEK_DONE"; payload: { week: Week; done: boolean } }
  | { type: "ADD_FEEDBACK"; payload: Feedback }
  | { type: "TOGGLE_WEEK_EXPAND"; payload: number }
  | {
      type: "ADAPT_PLAN";
      payload: { updatedWeeks: Week[]; adaptationNote: string; fromWeek: number };
    }
  | { type: "HIDE_ADAPTATION_BANNER" }
  | { type: "RESET_PLAN" };

export function topicKey(weekNumber: number, topicIndex: number): string {
  return `w${weekNumber}t${topicIndex}`;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload, hydrated: true };
    case "SET_LOCALE":
      return { ...state, locale: action.payload };
    case "SET_GENERATING":
      return { ...state, isGenerating: action.payload };
    case "SET_ADAPTING":
      return { ...state, isAdapting: action.payload };
    case "SET_PROFILE":
      return { ...state, userProfile: action.payload };
    case "SET_PLAN":
      return {
        ...state,
        plan: action.payload,
        weeks: action.payload.weeks,
        topicProgress: {},
        feedbackHistory: [],
        adaptationNote: action.payload.adaptation_note || null,
        changedWeeks: [],
        showAdaptationBanner: false,
      };
    case "TOGGLE_TOPIC": {
      const key = topicKey(action.payload.weekNumber, action.payload.topicIndex);
      return { ...state, topicProgress: { ...state.topicProgress, [key]: !state.topicProgress[key] } };
    }
    case "SET_WEEK_DONE": {
      const next = { ...state.topicProgress };
      action.payload.week.topics.forEach((_, i) => {
        next[topicKey(action.payload.week.week_number, i)] = action.payload.done;
      });
      return { ...state, topicProgress: next };
    }
    case "ADD_FEEDBACK":
      return { ...state, feedbackHistory: [...state.feedbackHistory, action.payload] };
    case "TOGGLE_WEEK_EXPAND":
      return {
        ...state,
        expandedWeek: state.expandedWeek === action.payload ? null : action.payload,
      };
    case "ADAPT_PLAN": {
      const { fromWeek, updatedWeeks, adaptationNote } = action.payload;
      // Keep everything the user has already seen (<= fromWeek) and replace the
      // future with the freshly generated weeks. Correct even if total_weeks changed.
      const kept = state.weeks.filter((w) => w.week_number <= fromWeek);
      const future = updatedWeeks.filter((w) => w.week_number > fromWeek);
      const merged = [...kept, ...future].sort((a, b) => a.week_number - b.week_number);

      // Drop topic-progress keys for any week beyond the threshold (rewritten weeks).
      const nextProgress: Record<string, boolean> = {};
      for (const [k, v] of Object.entries(state.topicProgress)) {
        const wn = Number(k.slice(1, k.indexOf("t")));
        if (wn <= fromWeek) nextProgress[k] = v;
      }

      const nextPlan: Plan | null = state.plan
        ? { ...state.plan, total_weeks: merged.length, adaptation_note: adaptationNote, weeks: merged }
        : state.plan;

      return {
        ...state,
        plan: nextPlan,
        weeks: merged,
        topicProgress: nextProgress,
        adaptationNote,
        changedWeeks: future.map((w) => w.week_number),
        showAdaptationBanner: true,
      };
    }
    case "HIDE_ADAPTATION_BANNER":
      return { ...state, showAdaptationBanner: false, changedWeeks: [] };
    case "RESET_PLAN":
      return { ...initialState, hydrated: true, locale: state.locale };
    default:
      return state;
  }
}

const STORAGE_KEY = "skillpath_state_v2";

const PlanContext = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      dispatch({ type: "HYDRATE", payload: raw ? JSON.parse(raw) : {} });
    } catch {
      dispatch({ type: "HYDRATE", payload: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { locale, userProfile, plan, weeks, topicProgress, feedbackHistory, adaptationNote } = state;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ locale, userProfile, plan, weeks, topicProgress, feedbackHistory, adaptationNote })
    );
  }, [state]);

  return <PlanContext.Provider value={{ state, dispatch }}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}

// ---- Selectors (derive week status from topic progress) ----
export function weekDoneCount(week: Week, tp: Record<string, boolean>): number {
  return week.topics.reduce(
    (n, _, i) => n + (tp[topicKey(week.week_number, i)] ? 1 : 0),
    0
  );
}

export function weekStatus(week: Week, tp: Record<string, boolean>): WeekStatus {
  const done = weekDoneCount(week, tp);
  if (week.topics.length > 0 && done === week.topics.length) return "completed";
  if (done > 0) return "in_progress";
  return "not_started";
}

export function computeOverallPercent(weeks: Week[], tp: Record<string, boolean>): number {
  const total = weeks.reduce((n, w) => n + w.topics.length, 0);
  if (total === 0) return 0;
  const done = weeks.reduce((n, w) => n + weekDoneCount(w, tp), 0);
  return Math.round((done / total) * 100);
}

export function countByStatus(weeks: Week[], tp: Record<string, boolean>) {
  let completed = 0,
    inProgress = 0,
    notStarted = 0;
  for (const w of weeks) {
    const s = weekStatus(w, tp);
    if (s === "completed") completed++;
    else if (s === "in_progress") inProgress++;
    else notStarted++;
  }
  return { completed, inProgress, notStarted };
}

/** First incomplete topic of a week, or null if the week is fully done. */
export function nextTopicIndex(week: Week, tp: Record<string, boolean>): number | null {
  for (let i = 0; i < week.topics.length; i++) {
    if (!tp[topicKey(week.week_number, i)]) return i;
  }
  return null;
}
