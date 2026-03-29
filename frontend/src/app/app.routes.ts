import { Routes } from '@angular/router';
import {Dashboard} from './pages/dashboard/dashboard';
import {Stats} from 'node:fs';

export const routes: Routes = [
  {
    path: "dashboard",
    component : Dashboard
  },
  {
    path:"stats",
    component : Stats
  },
  // {
  //   path:"dashboard/:id",
  //   component :
  // }
  {
    path:"**",
    redirectTo:"dashboard"
  }
];
