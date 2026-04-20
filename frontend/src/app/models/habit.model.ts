import { RepeatTypes } from './types';

export interface HabitModel {
  id: number;
  user: number;
  title: string;
  description: string;
  category: number | null;
  category_name?: string;
  repeat_type: RepeatTypes;
  target_days_per_week: number;
  week_days: number[];
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  color?: string;
  icon?: string;
}

export interface CreateHabitPayload {
  title: string;
  description: string;
  category?: number | null;
  repeat_type: RepeatTypes;
  target_days_per_week: number;
  week_days: number[];
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

