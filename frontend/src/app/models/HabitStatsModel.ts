export interface HabitStatsModel {
  habit_id: number;
  habit_title: string;
  total_done: number;
  total_missed: number;
  current_streak: number;
  longest_streak: number;
  success_rate: number;
}
