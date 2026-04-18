import { Priority } from './types';

export interface TodoModel{
  id: number;
  user_id: number;
  title: string;
  description: string;
  due_date: string;
  is_completed: boolean;
  priority: Priority;
  category: string;
  created_at: string;
}
