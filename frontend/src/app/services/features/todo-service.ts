import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { CreateTodoPayload, TodoModel } from '../../models/todo.model';
import { environment } from '../../../envs/env';
import { CategoryService } from './category-service';

interface TodoApiModel {
  id: number;
  user: number;
  title: string;
  description: string;
  due_date: string | null;
  is_completed: boolean;
  priority: TodoModel['priority'];
  category: number | null;
  category_name?: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = environment.apiUrl;
  private categoryService = inject(CategoryService);

  constructor(private http: HttpClient) {}

  getTodos(category?: string): Observable<TodoModel[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';

    return forkJoin({
      todos: this.http.get<TodoApiModel[]>(`${this.apiUrl}/todos/${query}`),
      categories: this.categoryService.getCategories(),
    }).pipe(
      map(({ todos, categories }) => {
        const categoryMap = new Map(categories.map((item) => [item.id, item.name]));
        return todos.map((todo) => this.toTodoModel(todo, categoryMap));
      })
    );
  }

  createTodo(payload: CreateTodoPayload): Observable<TodoModel> {
    const categoryName = (payload.category || 'General').trim();

    return this.getOrCreateCategory(categoryName).pipe(
      switchMap((categoryId) =>
        this.http
          .post<TodoApiModel>(`${this.apiUrl}/todos/`, {
            title: payload.title.trim(),
            description: payload.description.trim(),
            category: categoryId,
            due_date: payload.due_date || null,
            priority: payload.priority,
            is_completed: false,
          })
          .pipe(
            map((todo) =>
              this.toTodoModel(todo, new Map([[categoryId, categoryName]]))
            )
          )
      )
    );
  }

  updateTodoCompletion(todoId: number, isCompleted: boolean): Observable<TodoModel> {
    return this.http
      .patch<TodoApiModel>(`${this.apiUrl}/todos/${todoId}/`, { is_completed: isCompleted })
      .pipe(map((todo) => this.toTodoModel(todo, new Map())));
  }

  private getOrCreateCategory(categoryName: string): Observable<number> {
    return this.categoryService.getCategories().pipe(
      switchMap((categories) => {
        const existing = categories.find(
          (item) => item.name.toLowerCase() === categoryName.toLowerCase()
        );
        return existing
          ? of(existing.id)
          : this.categoryService.createCategory({ name: categoryName }).pipe(
              map((created) => created.id)
            );
      })
    );
  }

  private toTodoModel(todo: TodoApiModel, categoryMap: Map<number, string>): TodoModel {
    const categoryName =
      (typeof todo.category === 'number' ? categoryMap.get(todo.category) : undefined) ??
      todo.category_name ??
      'General';

    return {
      id: todo.id,
      user_id: todo.user,
      title: todo.title,
      description: todo.description,
      due_date: todo.due_date ?? new Date().toISOString().slice(0, 10),
      is_completed: todo.is_completed,
      priority: todo.priority,
      category: categoryName,
      created_at: todo.created_at,
    };
  }
}
