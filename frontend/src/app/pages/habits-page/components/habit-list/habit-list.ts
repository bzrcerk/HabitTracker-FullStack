import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HabitModel } from '../../../../models/habit.model';
import {HabitService} from '../../../../services/features/habit-service';

@Component({
  selector: 'app-habit-list',
  imports: [],
  templateUrl: './habit-list.html',
  styleUrl: './habit-list.css',
})
export class HabitList implements OnInit, OnChanges {
  private habitService = inject(HabitService);

  @Input() refreshTick = 0;

  habits : HabitModel[] = [];
  readonly weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  ngOnInit(): void {
    this.loadHabits();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshTick'] && !changes['refreshTick'].firstChange) {
      this.loadHabits();
    }
  }

  private loadHabits(): void {
    this.habitService.getHabits().subscribe({
      next: (habits) => {
        this.habits.splice(0, this.habits.length, ...habits);
      },
      error: () => {
        this.habits.splice(0, this.habits.length);
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
      return habit.week_days.includes(dayIndex);
    }

    return dayIndex === 0;
  }

  iconFromName(materialIcon: string): string {
    const iconMap: Record<string, string> = {
      water_drop: '💧',
      self_improvement: '🧘',
      fitness_center: '🏃',
      menu_book: '📚',
      call: '📞',
      payments: '💸',
      spa: '🌿',
      translate: '🈯'
    };

    return iconMap[materialIcon] ?? '•';
  }
}
