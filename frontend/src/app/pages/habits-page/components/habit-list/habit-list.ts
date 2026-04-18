import { Component } from '@angular/core';
import { HabitModel } from '../../../../models/habit.model';
import { mockHabits } from '../../../../services/fakedata/mockdata'

@Component({
  selector: 'app-habit-list',
  imports: [],
  templateUrl: './habit-list.html',
  styleUrl: './habit-list.css',
})
export class HabitList {
  protected habits : HabitModel[] = mockHabits;
}
