import { HabitModel } from '../../models/habit.model';
import { UserModel } from '../../models/user.model';
import { HabitCompletionModel } from '../../models/habit-completion.model';
import { TodoModel } from '../../models/todo.model';
import { DashboardStatsModel } from '../../models/dashboard-stats.model';


export const mockUser: UserModel = {
  id: 1,
  username: 'amina',
  email: 'amina@test.com',
  avatar: 'https://i.pravatar.cc/150?img=32'
};

export const mockHabits: HabitModel[] = [
  {
    id: 1,
    user_id: 1,
    title: 'Drink water',
    description: 'Drink at least 2 liters of water',
    repeat_type: 'daily',
    repeat_interval: 1,
    week_days: [],
    start_date: '2026-04-01',
    end_date: null,
    is_active: true,
    color: '#4FC3F7',
    icon: 'water_drop',
    created_at: '2026-04-01T08:00:00Z',
    updated_at: '2026-04-07T08:00:00Z'
  },
  {
    id: 2,
    user_id: 1,
    title: 'Morning stretch',
    description: '10 minutes of stretching after waking up',
    repeat_type: 'daily',
    repeat_interval: 1,
    week_days: [],
    start_date: '2026-04-02',
    end_date: null,
    is_active: true,
    color: '#81C784',
    icon: 'self_improvement',
    created_at: '2026-04-02T07:30:00Z',
    updated_at: '2026-04-07T07:30:00Z'
  },
  {
    id: 3,
    user_id: 1,
    title: 'Go to gym',
    description: 'Workout at the gym',
    repeat_type: 'weekly',
    repeat_interval: 1,
    week_days: [0, 2, 4],
    start_date: '2026-04-01',
    end_date: null,
    is_active: true,
    color: '#FF8A65',
    icon: 'fitness_center',
    created_at: '2026-04-01T09:00:00Z',
    updated_at: '2026-04-07T09:00:00Z'
  },
  {
    id: 4,
    user_id: 1,
    title: 'Read a book',
    description: 'Read 20 pages',
    repeat_type: 'daily',
    repeat_interval: 1,
    week_days: [],
    start_date: '2026-04-03',
    end_date: null,
    is_active: true,
    color: '#BA68C8',
    icon: 'menu_book',
    created_at: '2026-04-03T18:00:00Z',
    updated_at: '2026-04-07T18:00:00Z'
  },
  {
    id: 5,
    user_id: 1,
    title: 'Call parents',
    description: 'Talk to parents and check in',
    repeat_type: 'weekly',
    repeat_interval: 1,
    week_days: [6],
    start_date: '2026-04-01',
    end_date: null,
    is_active: true,
    color: '#FFD54F',
    icon: 'call',
    created_at: '2026-04-01T19:00:00Z',
    updated_at: '2026-04-07T19:00:00Z'
  },
  {
    id: 6,
    user_id: 1,
    title: 'Budget review',
    description: 'Check monthly expenses',
    repeat_type: 'monthly',
    repeat_interval: 1,
    week_days: [],
    start_date: '2026-04-05',
    end_date: null,
    is_active: true,
    color: '#90A4AE',
    icon: 'payments',
    created_at: '2026-04-05T12:00:00Z',
    updated_at: '2026-04-07T12:00:00Z'
  },
  {
    id: 7,
    user_id: 1,
    title: 'Meditation',
    description: '5 minutes of breathing practice',
    repeat_type: 'daily',
    repeat_interval: 2,
    week_days: [],
    start_date: '2026-04-01',
    end_date: null,
    is_active: true,
    color: '#64B5F6',
    icon: 'spa',
    created_at: '2026-04-01T06:50:00Z',
    updated_at: '2026-04-07T06:50:00Z'
  },
  {
    id: 8,
    user_id: 1,
    title: 'Practice English',
    description: 'Learn 10 new words',
    repeat_type: 'weekly',
    repeat_interval: 1,
    week_days: [1, 3, 5],
    start_date: '2026-04-01',
    end_date: null,
    is_active: false,
    color: '#F06292',
    icon: 'translate',
    created_at: '2026-04-01T20:00:00Z',
    updated_at: '2026-04-07T20:00:00Z'
  }
];

export const mockHabitCompletions: HabitCompletionModel[] = [
  {
    id: 1,
    habit_id: 1,
    completed_date: '2026-04-05',
    created_at: '2026-04-05T09:05:00Z'
  },
  {
    id: 2,
    habit_id: 1,
    completed_date: '2026-04-06',
    created_at: '2026-04-06T09:12:00Z'
  },
  {
    id: 3,
    habit_id: 1,
    completed_date: '2026-04-07',
    created_at: '2026-04-07T09:08:00Z'
  },
  {
    id: 4,
    habit_id: 2,
    completed_date: '2026-04-06',
    created_at: '2026-04-06T07:45:00Z'
  },
  {
    id: 5,
    habit_id: 2,
    completed_date: '2026-04-07',
    created_at: '2026-04-07T07:42:00Z'
  },
  {
    id: 6,
    habit_id: 3,
    completed_date: '2026-04-07',
    created_at: '2026-04-07T18:15:00Z'
  },
  {
    id: 7,
    habit_id: 4,
    completed_date: '2026-04-05',
    created_at: '2026-04-05T21:00:00Z'
  },
  {
    id: 8,
    habit_id: 4,
    completed_date: '2026-04-06',
    created_at: '2026-04-06T20:40:00Z'
  },
  {
    id: 9,
    habit_id: 7,
    completed_date: '2026-04-05',
    created_at: '2026-04-05T07:10:00Z'
  },
  {
    id: 10,
    habit_id: 7,
    completed_date: '2026-04-07',
    created_at: '2026-04-07T07:05:00Z'
  }
];

export const mockTodos: TodoModel[] = [
  {
    id: 1,
    user_id: 1,
    title: 'Finish Django serializers',
    description: 'Write serializers for habits and todos',
    due_date: '2026-04-07',
    is_completed: false,
    priority: 'high',
    category: 'Study',
    created_at: '2026-04-06T10:00:00Z'
  },
  {
    id: 2,
    user_id: 1,
    title: 'Prepare Angular mock service',
    description: 'Connect fake data to habit dashboard',
    due_date: '2026-04-07',
    is_completed: true,
    priority: 'high',
    category: 'Project',
    created_at: '2026-04-06T11:30:00Z'
  },
  {
    id: 3,
    user_id: 1,
    title: 'Buy groceries',
    description: 'Milk, eggs, bananas, chicken',
    due_date: '2026-04-08',
    is_completed: false,
    priority: 'medium',
    category: 'Personal',
    created_at: '2026-04-07T08:10:00Z'
  },
  {
    id: 4,
    user_id: 1,
    title: 'Submit web development lab',
    description: 'Upload to GitHub and copy repo link',
    due_date: '2026-04-09',
    is_completed: false,
    priority: 'high',
    category: 'University',
    created_at: '2026-04-07T09:00:00Z'
  },
  {
    id: 5,
    user_id: 1,
    title: 'Wash clothes',
    description: 'Do laundry in the evening',
    due_date: '2026-04-07',
    is_completed: true,
    priority: 'low',
    category: 'Home',
    created_at: '2026-04-06T17:20:00Z'
  },
  {
    id: 6,
    user_id: 1,
    title: 'Read DRF docs',
    description: 'Focus on ViewSets and @action',
    due_date: '2026-04-10',
    is_completed: false,
    priority: 'medium',
    category: 'Study',
    created_at: '2026-04-07T12:00:00Z'
  },
  {
    id: 7,
    user_id: 1,
    title: 'Plan next week',
    description: 'Write down study goals and deadlines',
    due_date: '2026-04-12',
    is_completed: false,
    priority: 'low',
    category: 'Planning',
    created_at: '2026-04-07T13:00:00Z'
  }
];

export const mockDashboardStats: DashboardStatsModel = {
  total_habits: 8,
  active_habits: 7,
  completed_today: 4,
  total_todos: 7,
  pending_todos: 5,
  completed_todos: 2,
  streak_days: 3
};
