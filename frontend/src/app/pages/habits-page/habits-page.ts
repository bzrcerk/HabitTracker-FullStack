import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HabitList} from './components/habit-list/habit-list';
import {CreateHabitPayload} from '../../models/habit.model';
import {HabitService} from '../../services/features/habit-service';
import {CategoryService} from '../../services/features/category-service';
import {CategoryModel} from '../../models/category.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-habits-page',
  imports: [
    HabitList,
    FormsModule
  ],
  templateUrl: './habits-page.html',
  styleUrl: './habits-page.css',
})
export class HabitsPage implements AfterViewInit {
  private habitService = inject(HabitService);
  private categoryService = inject(CategoryService);

  @ViewChild(HabitList) habitList?: HabitList;

  readonly repeatDayOptions = [
    { label: 'Mon', value: 0 },
    { label: 'Tue', value: 1 },
    { label: 'Wed', value: 2 },
    { label: 'Thu', value: 3 },
    { label: 'Fri', value: 4 },
    { label: 'Sat', value: 5 },
    { label: 'Sun', value: 6 }
  ];

  viewMode: 'week' | 'month' | 'year' = 'week';
  weekStartDate = this.getWeekStartDate(new Date());


  showCreateForm = false;
  isSubmitting = false;
  errorMessage = '';
  refreshTick = 0;
  categories: CategoryModel[] = [];

  newHabit: CreateHabitPayload = {
    title: '',
    description: '',
    category: null,
    repeat_type: 'daily',
    target_days_per_week: 7,
    week_days: [],
    start_date: this.getTodayDate(),
    end_date: null,
    is_active: true
  };

  constructor() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  ngAfterViewInit(): void {
    // Force a first refresh once child is mounted to avoid occasional empty first paint.
    queueMicrotask(() => this.habitList?.refresh());
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.errorMessage = '';
  }

  setTodayRange(): void {
    this.weekStartDate = this.getWeekStartDate(new Date());
  }

  setViewMode(mode: 'week' | 'month' | 'year'): void {
    this.viewMode = mode;
  }

  shiftRange(direction: -1 | 1): void {
    const base = new Date(`${this.weekStartDate}T00:00:00`);
    const deltaDays = this.viewMode === 'week' ? 7 : this.viewMode === 'month' ? 30 : 365;
    base.setDate(base.getDate() + direction * deltaDays);
    this.weekStartDate = this.getWeekStartDate(base);
  }

  toggleWeekDay(day: number): void {
    if (this.newHabit.repeat_type !== 'weekly') {
      return;
    }

    const set = new Set(this.newHabit.week_days);
    if (set.has(day)) {
      set.delete(day);
    } else {
      set.add(day);
    }

    this.newHabit.week_days = Array.from(set).sort((a, b) => a - b);
    this.newHabit.target_days_per_week = Math.max(this.newHabit.week_days.length, 1);
  }

  isWeekDaySelected(day: number): boolean {
    return this.newHabit.week_days.includes(day);
  }

  addHabit(): void {
    const payload = this.normalizeCreatePayload();

    if (!payload.title) {
      this.errorMessage = 'Habit title is required.';
      return;
    }

    if (payload.target_days_per_week < 1 || payload.target_days_per_week > 7) {
      this.errorMessage = 'Target days per week must be between 1 and 7.';
      return;
    }

    if (payload.repeat_type === 'weekly' && payload.week_days.length === 0) {
      this.errorMessage = 'Select at least one weekday for weekly habits.';
      return;
    }

    if (payload.end_date && payload.end_date < payload.start_date) {
      this.errorMessage = 'End date must be greater than or equal to start date.';
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
        this.newHabit.category = null;
        this.newHabit.repeat_type = 'daily';
        this.newHabit.target_days_per_week = 7;
        this.newHabit.week_days = [];
        this.newHabit.start_date = this.getTodayDate();
        this.habitList?.refresh();
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.errorMessage = this.extractApiError(error);
      }
    });
  }

  private normalizeCreatePayload(): CreateHabitPayload {
    const repeatType = this.newHabit.repeat_type;
    const normalizedRepeatType =
      repeatType === 'daily' || repeatType === 'weekly' || repeatType === 'monthly'
        ? repeatType
        : 'daily';

    const normalizedTarget = Number(this.newHabit.target_days_per_week);
    const normalizedCategory =
      this.newHabit.category === null || this.newHabit.category === undefined
        ? null
        : Number(this.newHabit.category);

    return {
      title: this.newHabit.title.trim(),
      description: this.newHabit.description.trim(),
      category: Number.isNaN(normalizedCategory as number) ? null : normalizedCategory,
      repeat_type: normalizedRepeatType,
      target_days_per_week: Number.isNaN(normalizedTarget) ? 7 : Math.max(1, Math.min(7, Math.round(normalizedTarget))),
      week_days: this.newHabit.week_days.slice(),
      start_date: this.newHabit.start_date,
      end_date: this.newHabit.end_date || null,
      is_active: Boolean(this.newHabit.is_active)
    };
  }

  get rangeLabel(): string {
    const start = new Date(`${this.weekStartDate}T00:00:00`);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}`;
  }

  private extractApiError(error: HttpErrorResponse): string {
    const message = error.error;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    if (message && typeof message === 'object') {
      const firstValue = Object.values(message)[0];

      if (Array.isArray(firstValue) && firstValue.length > 0) {
        return String(firstValue[0]);
      }

      if (typeof firstValue === 'string') {
        return firstValue;
      }
    }

    return 'Could not create habit. Please try again.';
  }

  private getTodayDate(): string {
    return this.formatLocalDate(new Date());
  }

  private getWeekStartDate(baseDate: Date): string {
    const day = (baseDate.getDay() + 6) % 7;
    const start = new Date(baseDate);
    start.setDate(baseDate.getDate() - day);
    return this.formatLocalDate(start);
  }

  private formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
