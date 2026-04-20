import {ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {AnalyticsService} from '../../services/features/analytics-service';
import {DashboardStatsModel} from '../../models/dashboard-stats.model';

@Component({
  selector: 'app-analytics-page',
  imports: [],
  templateUrl: './analytics-page.html',
  styleUrl: './analytics-page.css',
})
export class AnalyticsPage implements OnInit {
  private analyticsService = inject(AnalyticsService);
  private cdr = inject(ChangeDetectorRef);

  stats: DashboardStatsModel = {
    total_habits: 0,
    active_habits: 0,
    completed_today: 0,
    total_todos: 0,
    pending_todos: 0,
    completed_todos: 0,
    streak_days: 0
  };
  weekdayData = [
    { day: 'Mon', value: 0 },
    { day: 'Tue', value: 0 },
    { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 },
    { day: 'Fri', value: 0 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 }
  ];
  categoryBreakdown: Array<{ name: string; count: number; percent: number; color: string }> = [];
  completionRate = 0;
  donutStyle = 'conic-gradient(#1e293b 0% 100%)';

  ngOnInit(): void {
    this.analyticsService.getAnalyticsData().subscribe((analytics) => {
      this.stats = { ...analytics.stats };
      this.weekdayData = [...analytics.weekdayData];
      this.categoryBreakdown = [...analytics.categoryBreakdown];
      this.completionRate = analytics.completionRate;
      this.donutStyle = analytics.donutStyle;
      this.cdr.detectChanges();
    });
  }
}
