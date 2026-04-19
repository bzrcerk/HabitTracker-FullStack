import {Component, inject} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {TokenService} from '../../services/auth/token-service';
import {AnalyticsService} from '../../services/features/analytics-service';
import {TodoService} from '../../services/features/todo-service';
import {filter} from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
    private tokenService : TokenService = inject(TokenService);
    private router : Router = inject(Router);
    private analyticsService = inject(AnalyticsService);
    private todoService = inject(TodoService);

    pendingTodos = 0;
    isTodoRoute = false;
    selectedCategory = '';
    categories: Array<{ name: string; color: string }> = [];

    constructor() {
      this.analyticsService.getDashboardStats().subscribe({
        next: (stats) => {
          this.pendingTodos = stats.pending_todos;
        }
      });

      this.updateRouteState(this.router.url);
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
        const navEvent = event as NavigationEnd;
        this.updateRouteState(navEvent.urlAfterRedirects);
      });

      this.loadCategories();
    }

    private loadCategories(): void {
      const categoryColors = ['#fb7185', '#60a5fa', '#a78bfa', '#5eead4', '#fbbf24', '#34d399'];

      this.todoService.getTodos().subscribe({
        next: (todos) => {
          const uniqueNames = Array.from(new Set(todos.map((todo) => todo.category).filter(Boolean))).sort((a, b) => a.localeCompare(b));
          this.categories = uniqueNames.map((name, index) => ({
            name,
            color: categoryColors[index % categoryColors.length]
          }));
        }
      });
    }

    private updateRouteState(url: string): void {
      const [path, queryString] = url.split('?');
      this.isTodoRoute = path.startsWith('/todo');

      const params = new URLSearchParams(queryString ?? '');
      this.selectedCategory = params.get('category') ?? '';
    }

    logout() {
      this.tokenService.clearTokens();
      this.router.navigate(['/login']);
    }
}
