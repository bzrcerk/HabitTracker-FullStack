import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../envs/env';
import {Observable, map} from 'rxjs';
import {CreateHabitPayload, HabitModel} from '../../models/habit.model';
import {HabitStatsModel} from '../../models/HabitStatsModel';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHabits(categoryId?: number): Observable<HabitModel[]> {
    const query = typeof categoryId === 'number' ? `?category=${categoryId}` : '';

    return this.http.get<HabitModel[]>(`${this.apiUrl}/habits/${query}`)
  }

  createHabit(payload: CreateHabitPayload): Observable<HabitModel> {
    return this.http.post<HabitModel>(`${this.apiUrl}/habits/`, payload);
  }
}
