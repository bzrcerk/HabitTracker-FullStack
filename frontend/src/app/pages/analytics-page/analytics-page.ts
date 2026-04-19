import { Component, inject } from '@angular/core';
import {AnalyticsService} from '../../services/features/analytics-service';
import {DashboardStatsModel} from '../../models/dashboard-stats.model';

@Component({
  selector: 'app-analytics-page',
  imports: [],
  templateUrl: './analytics-page.html',
  styleUrl: './analytics-page.css',
})
export class AnalyticsPage {
  private analyticsService = inject(AnalyticsService);
  readonly stats: DashboardStatsModel = {
    total_habits: 0,
    active_habits: 0,
    completed_today: 0,
    total_todos: 0,
    pending_todos: 0,
    completed_todos: 0,
    streak_days: 0
  };
  readonly weekdayData = [
    { day: 'Mon', value: 0 },
    { day: 'Tue', value: 0 },
    { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 },
    { day: 'Fri', value: 0 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 }
  ];
  readonly categoryBreakdown: Array<{ name: string; count: number; percent: number; color: string }> = [];
  completionRate = 0;
  donutStyle = 'conic-gradient(#1e293b 0% 100%)';

  constructor() {
    this.analyticsService.getAnalyticsData().subscribe((analytics) => {
      Object.assign(this.stats, analytics.stats);
      this.weekdayData.splice(0, this.weekdayData.length, ...analytics.weekdayData);
      this.categoryBreakdown.splice(0, this.categoryBreakdown.length, ...analytics.categoryBreakdown);
      this.completionRate = analytics.completionRate;
      this.donutStyle = analytics.donutStyle;
    });
  }
}
