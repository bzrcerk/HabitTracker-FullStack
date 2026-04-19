import { Component, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HabitList} from './components/habit-list/habit-list';
import {AnalyticsService} from '../../services/features/analytics-service';
import {CreateHabitPayload} from '../../models/habit.model';
import {HabitService} from '../../services/features/habit-service';

@Component({
  selector: 'app-habits-page',
  imports: [
    HabitList,
    FormsModule
  ],
  templateUrl: './habits-page.html',
  styleUrl: './habits-page.css',
})
export class HabitsPage {
  private analyticsService = inject(AnalyticsService);
  private habitService = inject(HabitService);

  readonly stats = [
    { label: 'Completed', value: '78%', color: '#fb7185' },
    { label: 'Best day', value: '0d', color: '#fcd34d' },
    { label: 'Total done', value: '0', color: '#5eead4' },
    { label: 'Best streak', value: '0d', color: '#a78bfa' }
  ];

  showCreateForm = false;
  isSubmitting = false;
  errorMessage = '';
  refreshTick = 0;

  newHabit: CreateHabitPayload = {
    title: '',
    description: '',
    repeat_type: 'daily',
    repeat_interval: 1,
    week_days: [],
    start_date: this.getTodayDate(),
    end_date: null,
    is_active: true,
    color: '#a78bfa',
    icon: 'spa'
  };

  constructor() {
    this.analyticsService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats[1].value = `${stats.streak_days}d`;
        this.stats[2].value = `${stats.completed_today * 10 + 2}`;
        this.stats[3].value = `${stats.streak_days + 2}d`;
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.errorMessage = '';
  }

  addHabit(): void {
    const payload: CreateHabitPayload = {
      ...this.newHabit,
      title: this.newHabit.title.trim(),
      description: this.newHabit.description.trim()
    };

    if (!payload.title) {
      this.errorMessage = 'Habit title is required.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.habitService.createHabit(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showCreateForm = false;
        this.refreshTick += 1;
        this.newHabit.title = '';
        this.newHabit.description = '';
        this.newHabit.repeat_type = 'daily';
        this.newHabit.start_date = this.getTodayDate();
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Could not create habit. Please try again.';
      }
    });
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

}
