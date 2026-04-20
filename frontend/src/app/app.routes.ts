import { Routes } from '@angular/router';
import {TodoPage} from './pages/todo-page/todo-page';
import {HabitsPage} from './pages/habits-page/habits-page';
import {AnalyticsPage} from './pages/analytics-page/analytics-page';
import {LoginPage} from './pages/login-page/login-page';
import {RegisterPage} from './pages/register-page/register-page';
import {authGuard} from './services/guards/auth-guard';

export const routes: Routes = [
  {
    path: "todo",
    component : TodoPage,
    canActivate : [authGuard]
  },
  {
    path:"habits",
    component : HabitsPage,
    canActivate : [authGuard]
  },
  {
    path:"analytics",
    component : AnalyticsPage,
    canActivate : [authGuard]
  },
  {
    path : "login",
    component : LoginPage
  },
  {
    path:"register",
    component : RegisterPage
  },
  {
    path: "**",
    redirectTo : '/todo'
  }
];
