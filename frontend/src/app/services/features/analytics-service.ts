import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../envs/env';
import {DashboardStatsModel} from '../../models/dashboard-stats.model';
import {TodoModel} from '../../models/todo.model';
import {HabitCompletionModel} from '../../models/habit-completion.model';
import {Observable, catchError, forkJoin, map} from 'rxjs';

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
  private http: HttpClient;
  private apiUrl = environment.apiUrl;
  private readonly dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  private readonly chartPalette = ['#a78bfa', '#fb7185', '#5eead4', '#60a5fa', '#f59e0b', '#34d399'];

  constructor(http: HttpClient) {
    this.http = http;
  }

  getAnalyticsData(): Observable<AnalyticsViewModel> {
    return forkJoin({
      stats: this.getStatsFromApi(),
      todos: this.getTodosFromApi(),
      completions: this.getCompletionsFromApi()
    }).pipe(
      map(({stats, todos, completions}) => {
        const weekdayData = this.getWeekdayData(completions);
        const categoryBreakdown = this.getCategoryBreakdown(todos);

        return {
          stats,
          completionRate: this.getCompletionRate(stats),
          weekdayData,
          categoryBreakdown,
          donutStyle: this.buildDonutStyle(categoryBreakdown)
        };
      })
    );
  }

  getDashboardStats(): Observable<DashboardStatsModel> {
    return this.getStatsFromApi();
  }

  private getStatsFromApi(): Observable<DashboardStatsModel> {
    return this.http.get<DashboardStatsModel>(`${this.apiUrl}/dashboard/stats/`).pipe(
      catchError(() => this.http.get<DashboardStatsModel>(`${this.apiUrl}/analytics/stats/`))
    );
  }

  private getTodosFromApi(): Observable<TodoModel[]> {
    return this.http.get<TodoModel[] | { results: TodoModel[] }>(`${this.apiUrl}/todos/`).pipe(
      map((response) => this.unwrapListResponse(response))
    );
  }

  private getCompletionsFromApi(): Observable<HabitCompletionModel[]> {
    return this.http
      .get<HabitCompletionModel[] | { results: HabitCompletionModel[] }>(`${this.apiUrl}/habit-completions/`)
      .pipe(
        map((response) => this.unwrapListResponse(response)),
        catchError(() =>
          this.http
            .get<HabitCompletionModel[] | { results: HabitCompletionModel[] }>(`${this.apiUrl}/habits/completions/`)
            .pipe(map((response) => this.unwrapListResponse(response)))
        )
      );
  }

  private unwrapListResponse<T>(response: T[] | { results: T[] }): T[] {
    if (Array.isArray(response)) {
      return response;
    }

    return response.results ?? [];
  }

  private getCompletionRate(stats: DashboardStatsModel): number {
    if (stats.total_todos === 0) {
      return 0;
    }

    return Math.round((stats.completed_todos / stats.total_todos) * 100);
  }

  private getWeekdayData(completions: HabitCompletionModel[]): WeekdayAnalyticsItem[] {
    const dayCounts = new Map<string, number>(
      this.dayOrder.map((dayName) => [dayName, 0])
    );

    completions.forEach((completion) => {
      const dayName = this.dayOrder[new Date(completion.completed_date).getDay()];
      dayCounts.set(dayName, (dayCounts.get(dayName) ?? 0) + 1);
    });

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
      day,
      value: dayCounts.get(day) ?? 0
    }));
  }

  private getCategoryBreakdown(todos: TodoModel[]): CategoryBreakdownItem[] {
    const categoryCountMap = new Map<string, number>();
    const total = todos.length || 1;

    todos.forEach((todo: TodoModel) => {
      categoryCountMap.set(todo.category, (categoryCountMap.get(todo.category) ?? 0) + 1);
    });

    const breakdown = Array.from(categoryCountMap.entries())
      .map(([name, count], index) => ({
        name,
        count,
        percent: Math.round((count / total) * 100),
        color: this.chartPalette[index % this.chartPalette.length]
      }))
      .sort((a, b) => b.percent - a.percent);

    return this.normalizePercentages(breakdown);
  }

  private normalizePercentages(items: CategoryBreakdownItem[]): CategoryBreakdownItem[] {
    if (items.length === 0) {
      return items;
    }

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
