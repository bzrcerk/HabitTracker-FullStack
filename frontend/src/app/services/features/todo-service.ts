import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../envs/env';
import {Observable, map} from 'rxjs';
import {CreateTodoPayload, TodoModel} from '../../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTodos(category?: string): Observable<TodoModel[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';

    return this.http
      .get<TodoModel[] | { results: TodoModel[] }>(`${this.apiUrl}/todos/${query}`)
      .pipe(map((response) => this.unwrapListResponse(response)));
  }

  createTodo(payload: CreateTodoPayload): Observable<TodoModel> {
    return this.http.post<TodoModel>(`${this.apiUrl}/todos/`, payload);
  }

  private unwrapListResponse<T>(response: T[] | { results: T[] }): T[] {
    if (Array.isArray(response)) {
      return response;
    }

    return response.results ?? [];
  }
}
