import { Routes } from '@angular/router';
import {TodoPage} from './pages/todo-page/todo-page';
import {HabitsPage} from './pages/habits-page/habits-page';
import {AnalyticsPage} from './pages/analytics-page/analytics-page';

export const routes: Routes = [
  {
    path: "todo",
    component : TodoPage
  },
  {
    path:"habits",
    component : HabitsPage
  },
  {
    path:"analytics",
    component : AnalyticsPage
  },
  {
    path:"**",
    redirectTo:"todo"
  }
];
