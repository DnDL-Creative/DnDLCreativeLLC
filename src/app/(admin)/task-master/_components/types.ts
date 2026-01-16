export type ViewType =
  | "task"
  | "code_snippet"
  | "social_bookmark"
  | "resource"
  | "level_up"
  | "ledger"; // <--- ADDED ledger
export type RecurrenceType =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "one_off"
  | "archived";
export type SortOption =
  | "manual"
  | "date_asc"
  | "date_desc"
  | "created_desc"
  | "alpha_asc"
  | "alpha_desc";

export type TaskItem = {
  id: string;
  type: ViewType;
  title: string;
  content?: string;
  status: "active" | "completed" | "archived";
  recurrence?: string;
  due_date?: string | null;
  parent_id?: string | null;
  subtasks?: TaskItem[];
  tags?: string[];
  position?: number;
  metadata?: {
    // Level Up Fields
    platform?: string;
    total_hours?: number;
    hours_completed?: number;
    daily_study_goal?: number;

    // Ledger Fields (NEW)
    app_name?: string;
    ticket_type?: "bug" | "feature" | "refactor";
    priority?: "critical" | "high" | "normal" | "low";
  };
  created_at: string;
  user_id: string;
};
