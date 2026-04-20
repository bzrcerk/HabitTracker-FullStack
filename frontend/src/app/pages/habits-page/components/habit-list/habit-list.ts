import {ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { HabitModel } from '../../../../models/habit.model';
import {HabitService} from '../../../../services/features/habit-service';
import {CategoryService} from '../../../../services/features/category-service';
import {CategoryModel} from '../../../../models/category.model';
import {HabitLogService} from '../../../../services/features/habit-log-service';
import {HabitCompletionModel} from '../../../../models/habit-completion.model';

@Component({
  selector: 'app-habit-list',
  imports: [],
  templateUrl: './habit-list.html',
  styleUrl: './habit-list.css',
})
export class HabitList implements OnInit, OnChanges {
  private habitService = inject(HabitService);
  private categoryService = inject(CategoryService);
  private habitLogService = inject(HabitLogService);
  private cdr = inject(ChangeDetectorRef);

  @Input() refreshTick = 0;
  @Input() weekStartDate = new Date().toISOString().split('T')[0];

  habits : HabitModel[] = [];
  categories: CategoryModel[] = [];
  logs: HabitCompletionModel[] = [];
  isSaving = false;
  readonly weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  ngOnInit(): void {
    this.loadCategories();
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshTick'] && !changes['refreshTick'].firstChange) {
      this.refresh();
    }
  }

  refresh(): void {
    this.loadHabits();
    this.loadLogs();
  }

  private loadHabits(): void {
    this.habitService.getHabits().subscribe({
      next: (habits) => {
        this.habits = habits;
        this.cdr.detectChanges();
      },
      error: () => {
        this.habits = [];
      }
    });
  }

  private loadLogs(): void {
    this.habitLogService.getHabitLogs().subscribe({
      next: (logs) => {
        this.logs = logs;
        this.cdr.detectChanges();
      },
      error: () => {
        this.logs = [];
      }
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.cdr.detectChanges();
      },
      error: () => {
        this.categories = [];
      }
    });
  }

  isPlannedDay(habit: HabitModel, dayIndex: number): boolean {
    if (!habit.is_active) {
      return false;
    }

    if (habit.repeat_type === 'daily') {
      return true;
    }

    if (habit.repeat_type === 'weekly') {
      const weekDays = Array.isArray(habit.week_days) ? habit.week_days : [];

      if (weekDays.length > 0) {
        return weekDays.includes(dayIndex);
      }

      return dayIndex < habit.target_days_per_week;
    }

    return dayIndex === 0;
  }

  colorForHabit(habit: HabitModel): string {
    const categoryColor = this.categories.find((item) => item.id === habit.category)?.color;
    return categoryColor ?? '#a78bfa';
  }

  iconForHabit(habit: HabitModel): string {
    if (habit.repeat_type === 'daily') {
      return '•';
    }

    if (habit.repeat_type === 'weekly') {
      return '◦';
    }

    return '◇';
  }

  toggleCompletion(habit: HabitModel, dayIndex: number): void {
    if (this.isSaving) {
      return;
    }

    const date = this.getDateForDay(dayIndex);
    const existing = this.logs.find((log) => log.habit_id === habit.id && log.completed_date === date);
    this.isSaving = true;

    if (existing) {
      const nextStatus = existing.status === 'done' ? 'missed' : 'done';
      this.habitLogService.updateHabitLog(existing.id, {
        status: nextStatus,
        note: existing.note ?? ''
      }).subscribe({
        next: () => {
          this.isSaving = false;
          this.loadLogs();
        },
        error: () => {
          this.isSaving = false;
        }
      });
      return;
    }

    this.habitLogService.createHabitLog({
      habit_id: habit.id,
      completed_date: date,
      status: 'done'
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.loadLogs();
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  isCellPending(habitId: number, dayIndex: number): boolean {
    void habitId;
    void dayIndex;
    return this.isSaving;
  }

  isCompleted(habitId: number, dayIndex: number): boolean {
    const date = this.getDateForDay(dayIndex);
    return this.logs.some((log) => log.habit_id === habitId && log.completed_date === date && log.status === 'done');
  }

  private getDateForDay(dayIndex: number): string {
    const start = new Date(`${this.weekStartDate}T00:00:00`);
    start.setDate(start.getDate() + dayIndex);
    return this.formatLocalDate(start);
  }

  private formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
