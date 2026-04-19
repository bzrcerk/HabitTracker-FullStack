import { RepeatTypes } from './types';

export interface HabitModel {
  id: number;
  user_id: number;
  title: string;
  description: string;
  repeat_type: RepeatTypes;
  repeat_interval: number;
  week_days: number[]; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface CreateHabitPayload {
  title: string;
  description: string;
  repeat_type: RepeatTypes;
  repeat_interval: number;
  week_days: number[];
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  color: string;
  icon: string;
}

