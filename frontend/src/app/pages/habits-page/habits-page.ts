import { Component } from '@angular/core';
import {HabitList} from './components/habit-list/habit-list';

@Component({
  selector: 'app-habits-page',
  imports: [
    HabitList
  ],
  templateUrl: './habits-page.html',
  styleUrl: './habits-page.css',
})
export class HabitsPage {

}
