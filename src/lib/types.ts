// Layer 1 — Domain types for SkillPath AI

export type Level = "Absolute Beginner" | "Beginner" | "Intermediate" | "Advanced";
export type ResourcePreference = "Free only" | "Free + Low cost" | "Any";
export type LearningStyle = "Hands-on" | "Videos" | "Reading" | "Projects";

export interface UserProfile {
  skill: string;
  current_level: Level;
  goal: string;
  time_available: string; // e.g. "5-7 hours/week"
  learning_style: LearningStyle[];
  resource_preference: ResourcePreference;
}

export type Difficulty = "Too Easy" | "Just Right" | "Too Hard";

export interface Feedback {
  week_number: number;
  difficulty: Difficulty;
  comment: string;
  completed: boolean;
}

export type TopicType =
  | "Safety"
  | "Theory"
  | "Demonstration"
  | "Hands-On Practice"
  | "Project"
  | "Review"
  | "Assessment";

export type ResourceType =
  | "Video"
  | "Article"
  | "Interactive"
  | "Practice Guide"
  | "Tool/Equipment";

export type Cost = "Free" | "Low" | "Premium";

export interface Resource {
  title: string;
  url: string;
  type: ResourceType;
  cost: Cost;
  preferred: boolean;
}

export interface Topic {
  name: string;
  type: TopicType;
  estimated_minutes: number;
  resources: Resource[];
}

export type WeekDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Week {
  week_number: number;
  title: string;
  objective: string;
  topics: Topic[];
  total_time_minutes: number;
  difficulty: WeekDifficulty;
  milestone: string;
}

export interface Plan {
  plan_id: string;
  skill: string;
  total_weeks: number;
  weekly_time_hours: number;
  weeks: Week[];
  estimated_total_cost: string;
  adaptation_note: string;
  // client-side metadata (not from LLM)
  profile?: UserProfile;
}

export type WeekStatus = "not_started" | "in_progress" | "completed";
