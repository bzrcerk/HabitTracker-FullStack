import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../envs/env';
import { DashboardStatsModel } from '../../models/dashboard-stats.model';
import { HabitCompletionModel } from '../../models/habit-completion.model';
import { HabitModel } from '../../models/habit.model';
import { CategoryModel } from '../../models/category.model';

interface DashboardApiResponse {
  total_habits: number;
  completed_today: number;
  weekly_completions: number;
  current_streak: number;
}

export interface WeekdayAnalyticsItem {
  day: string;
  value: number;
}

export interface CategoryBreakdownItem {
  name: string;
  count: number;
  percent: number;
  color: string;
}

export interface AnalyticsViewModel {
  stats: DashboardStatsModel;
  completionRate: number;
  weekdayData: WeekdayAnalyticsItem[];
  categoryBreakdown: CategoryBreakdownItem[];
  donutStyle: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private readonly dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  private readonly chartPalette = ['#a78bfa', '#fb7185', '#5eead4', '#60a5fa', '#f59e0b', '#34d399'];


  getAnalyticsData(): Observable<AnalyticsViewModel> {
    return forkJoin({
      stats: this.http.get<DashboardApiResponse>(`${this.apiUrl}/dashboard/`),
      habits: this.http.get<HabitModel[]>(`${this.apiUrl}/habits/`),
      categories: this.http.get<CategoryModel[]>(`${this.apiUrl}/categories/`),
      completions: this.http.get<HabitCompletionModel[]>(`${this.apiUrl}/habit-logs/`)
    }).pipe(
      map(({ stats, habits, categories, completions }) => {
        const weeklyDone = this.countWeeklyDone(completions);
        const weeklyTarget = this.countWeeklyTarget(habits);

        return {
          stats: this.toStatsModel(stats, weeklyDone, completions),
          completionRate: this.calculateCompletionRate(weeklyDone, weeklyTarget),
          weekdayData: this.toWeekdayData(completions),
          categoryBreakdown: this.toCategoryBreakdown(habits, categories),
          donutStyle: this.buildDonutStyle(this.toCategoryBreakdown(habits, categories))
        };
      })
    );
  }

  private toStatsModel(
    response: DashboardApiResponse,
    weeklyDone: number,
    completions: HabitCompletionModel[]
  ): DashboardStatsModel {
    return {
      total_habits: response.total_habits,
      active_habits: response.total_habits,
      completed_today: response.completed_today,
      total_todos: response.total_habits,
      pending_todos: Math.max(response.total_habits - response.completed_today, 0),
      completed_todos: weeklyDone,
      streak_days: this.calculateStreak(completions),
      weekly_completions: response.weekly_completions,
      current_streak: response.current_streak
    };
  }

  private calculateCompletionRate(doneCount: number, targetCount: number): number {
    if (targetCount <= 0) return 0;
    const rate = Math.round((doneCount / targetCount) * 100);
    return Math.max(0, Math.min(rate, 100));
  }

  private calculateStreak(completions: HabitCompletionModel[]): number {
    const doneDates = Array.from(
      new Set(
        completions
          .filter((c) => c.status === 'done')
          .map((c) => c.completed_date)
      )
    ).sort((a, b) => a.localeCompare(b));

    if (doneDates.length === 0) return 0;

    let streak = 1;
    for (let i = doneDates.length - 2; i >= 0; i--) {
      const expected = this.shiftDate(doneDates[i + 1], -1);
      if (doneDates[i] === expected) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  private shiftDate(date: string, deltaDays: number): string {
    const d = new Date(`${date}T00:00:00`);
    d.setDate(d.getDate() + deltaDays);
    return this.toDateString(d);
  }

  private toDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private countWeeklyDone(completions: HabitCompletionModel[]): number {
    const { weekStart, weekEnd } = this.getWeekRange();
    return completions.filter(
      (c) => c.status === 'done' && c.completed_date >= weekStart && c.completed_date <= weekEnd
    ).length;
  }

  private countWeeklyTarget(habits: HabitModel[]): number {
    return habits.reduce((total, habit) => {
      if (!habit.is_active) return total;
      if (habit.repeat_type === 'daily') return total + 7;
      if (habit.repeat_type === 'weekly') {
        const days = Array.isArray(habit.week_days) ? habit.week_days.length : 0;
        return total + Math.max(days, habit.target_days_per_week || 0);
      }
      return total + 1;
    }, 0);
  }

  private getWeekRange(): { weekStart: string; weekEnd: string } {
    const now = new Date();
    const dayIndex = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayIndex);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      weekStart: this.toDateString(monday),
      weekEnd: this.toDateString(sunday)
    };
  }

  private toWeekdayData(completions: HabitCompletionModel[]): WeekdayAnalyticsItem[] {
    const counts = new Map<string, number>(this.dayOrder.map((d) => [d, 0]));

    completions
      .filter((c) => c.status === 'done')
      .forEach((c) => {
        const day = this.dayOrder[new Date(c.completed_date).getDay()];
        counts.set(day, (counts.get(day) ?? 0) + 1);
      });

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
      day,
      value: counts.get(day) ?? 0
    }));
  }

  private toCategoryBreakdown(habits: HabitModel[], categories: CategoryModel[]): CategoryBreakdownItem[] {
    const counts = new Map<string, number>();
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
    const total = habits.length || 1;

    habits.forEach((habit) => {
      const catName =
        (habit.category ? categoryMap.get(habit.category) : undefined) ?? habit.category_name ?? 'Uncategorized';
      counts.set(catName, (counts.get(catName) ?? 0) + 1);
    });

    const items = Array.from(counts.entries())
      .map(([name, count], idx) => ({
        name,
        count,
        percent: Math.round((count / total) * 100),
        color: this.chartPalette[idx % this.chartPalette.length]
      }))
      .sort((a, b) => b.percent - a.percent);

    return this.normalizePercents(items);
  }

  private normalizePercents(items: CategoryBreakdownItem[]): CategoryBreakdownItem[] {
    if (items.length === 0) return items;
    const sum = items.reduce((acc, item) => acc + item.percent, 0);
    const delta = 100 - sum;
    items[0] = { ...items[0], percent: Math.max(0, items[0].percent + delta) };
    return items;
  }

  private buildDonutStyle(items: CategoryBreakdownItem[]): string {
    if (items.length === 0) {
      return 'conic-gradient(#1e293b 0% 100%)';
    }

    let current = 0;
    const segments = items.map((item) => {
      const start = current;
      current += item.percent;
      return `${item.color} ${start}% ${current}%`;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }
}
