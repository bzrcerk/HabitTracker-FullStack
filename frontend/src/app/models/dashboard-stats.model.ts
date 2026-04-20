export interface DashboardStatsModel {
  total_habits: number;
  active_habits: number;
  completed_today: number;
  total_todos: number;
  pending_todos: number;
  completed_todos: number;
  streak_days: number;
  weekly_completions?: number;
  current_streak?: number;
}
