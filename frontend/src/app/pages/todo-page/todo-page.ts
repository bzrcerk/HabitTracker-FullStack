import { Component, inject } from '@angular/core';
import {TodoModel} from '../../models/todo.model';
import {TodoService} from '../../services/features/todo-service';

type TodoFilter = 'all' | 'active' | 'completed';

interface TodoGroup {
  category: string;
  todos: TodoModel[];
}

@Component({
  selector: 'app-todo-page',
  imports: [],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.css',
})
export class TodoPage {
  private todoService = inject(TodoService);

  readonly todos: TodoModel[] = [];
  readonly filters: Array<{ label: string; value: TodoFilter }> = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' }
  ];

  activeFilter: TodoFilter = 'all';

  constructor() {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos.splice(0, this.todos.length, ...todos);
      },
      error: () => {
        this.todos.splice(0, this.todos.length);
      }
    });
  }

  setFilter(filter: TodoFilter): void {
    this.activeFilter = filter;
  }

  isFilterActive(filter: TodoFilter): boolean {
    return this.activeFilter === filter;
  }

  get groupedTodos(): TodoGroup[] {
    const filteredTodos = this.todos.filter((todo) => {
      if (this.activeFilter === 'active') {
        return !todo.is_completed;
      }

      if (this.activeFilter === 'completed') {
        return todo.is_completed;
      }

      return true;
    });

    const groupedMap = new Map<string, TodoModel[]>();
    filteredTodos.forEach((todo) => {
      const current = groupedMap.get(todo.category) ?? [];
      current.push(todo);
      groupedMap.set(todo.category, current);
    });

    return Array.from(groupedMap.entries()).map(([category, todos]) => ({
      category,
      todos
    }));
  }

  get dueLabelMap(): Map<number, string> {
    return new Map(
      this.todos.map((todo) => {
        const date = new Date(todo.due_date);
        const now = new Date();
        const diffDays = Math.floor((date.getTime() - now.setHours(0, 0, 0, 0)) / 86400000);

        if (diffDays === 0) {
          return [todo.id, 'today'];
        }

        if (diffDays === 1) {
          return [todo.id, 'tomorrow'];
        }

        return [todo.id, date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()];
      })
    );
  }

}
