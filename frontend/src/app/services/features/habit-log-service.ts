import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../envs/env';
import { HabitCompletionModel } from '../../models/habit-completion.model';

export interface CreateHabitLogPayload {
  habit_id: number;
  completed_date: string;
  status?: 'done' | 'missed';
  note?: string;
}

export interface UpdateHabitLogPayload {
  habit_id?: number;
  completed_date?: string;
  status?: 'done' | 'missed';
  note?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HabitLogService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHabitLogs(): Observable<HabitCompletionModel[]> {
    return this.http.get<HabitCompletionModel[]>(`${this.apiUrl}/habit-logs/`);
  }

  createHabitLog(payload: CreateHabitLogPayload): Observable<HabitCompletionModel> {
    return this.http.post<HabitCompletionModel>(`${this.apiUrl}/habit-logs/`, {
      status: 'done',
      ...payload,
    });
  }

  updateHabitLog(logId: number, payload: UpdateHabitLogPayload): Observable<HabitCompletionModel> {
    return this.http.patch<HabitCompletionModel>(`${this.apiUrl}/habit-logs/${logId}/`, payload);
  }
}

