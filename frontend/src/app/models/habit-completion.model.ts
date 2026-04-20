export interface HabitCompletionModel {
  id: number;
  habit_id: number;
  completed_date: string;
  status: 'done' | 'missed';
  note?: string;
  created_at: string;
}
