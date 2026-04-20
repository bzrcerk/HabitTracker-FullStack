import {Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TodoModel} from '../../models/todo.model';
import {TodoService} from '../../services/features/todo-service';

type TodoFilter = 'all' | 'active' | 'completed';

interface TodoGroup {
  category: string;
  todos: TodoModel[];
}

@Component({
  selector: 'app-todo-page',
  imports: [FormsModule],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.css',
})
export class TodoPage implements OnInit {
  private todoService = inject(TodoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  todos: TodoModel[] = [];
  readonly filters: Array<{ label: string; value: TodoFilter }> = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' }
  ];

  activeFilter: TodoFilter = 'all';
  showTodayOnly = false;
  selectedCategory = '';
  isSubmitting = false;
  isUpdating = false;
  errorMessage = '';
  newTask = {
    title: '',
    category: '',
    due_date: this.getTodayDate()
  };

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.selectedCategory = params.get('category') ?? '';
      this.loadTodos();
      this.cdr.detectChanges();
    });
  }

  addTodo(): void {
    const title = this.newTask.title.trim();

    if (!title) {
      this.errorMessage = 'Task title is required.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.todoService.createTodo({
      title,
      description: '',
      due_date: this.newTask.due_date || this.getTodayDate(),
      priority: 'medium',
      category: this.newTask.category.trim() || this.selectedCategory || 'General'
    }).subscribe({
      next: (createdTodo) => {
        this.isSubmitting = false;
        this.activeFilter = 'all';
        this.newTask.title = '';
        this.newTask.category = '';
        this.newTask.due_date = this.getTodayDate();

        this.todos = [createdTodo, ...this.todos];

        if (
          this.selectedCategory &&
          createdTodo.category.toLowerCase() !== this.selectedCategory.toLowerCase()
        ) {
          this.router.navigate(['/todo']);
          return;
        }

        this.loadTodos();
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Could not create task. Please try again.';
      }
    });
  }

  clearCategoryFilter(): void {
    this.router.navigate(['/todo']);
  }

  toggleTodayOnly(): void {
    this.showTodayOnly = !this.showTodayOnly;
  }

  toggleTodoCompletion(todo: TodoModel): void {
    if (this.isUpdating) {
      return;
    }

    this.isUpdating = true;
    const nextValue = !todo.is_completed;

    this.todoService.updateTodoCompletion(todo.id, nextValue).subscribe({
      next: (updatedTodo) => {
        this.isUpdating = false;
        this.todos = this.todos.map((item) => (item.id === todo.id ? updatedTodo : item));
        this.cdr.detectChanges();
      },
      error: () => {
        this.isUpdating = false;
        this.errorMessage = 'Could not update task status.';
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
      if (this.showTodayOnly && todo.due_date !== this.getTodayDate()) {
        return false;
      }

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

  private loadTodos(): void {
    this.todoService.getTodos(this.selectedCategory || undefined).subscribe({
      next: (todos) => {
        this.todos = todos.reverse();
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load tasks from backend.';
      }
    });
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

}
