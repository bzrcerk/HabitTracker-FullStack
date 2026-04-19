import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../envs/env';
import {Observable, map} from 'rxjs';
import {CreateHabitPayload, HabitModel} from '../../models/habit.model';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHabits(): Observable<HabitModel[]> {
    return this.http
      .get<HabitModel[] | { results: HabitModel[] }>(`${this.apiUrl}/habits/`)
      .pipe(map((response) => this.unwrapListResponse(response)));
  }

  createHabit(payload: CreateHabitPayload): Observable<HabitModel> {
    return this.http.post<HabitModel>(`${this.apiUrl}/habits/`, payload);
  }

  private unwrapListResponse<T>(response: T[] | { results: T[] }): T[] {
    if (Array.isArray(response)) {
      return response;
    }

    return response.results ?? [];
  }
}
