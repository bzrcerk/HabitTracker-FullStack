import { AsyncPipe } from '@angular/common';
import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {TokenService} from '../../services/auth/token-service';
import {CategoryService} from '../../services/features/category-service';
import {TodoService} from '../../services/features/todo-service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
    private tokenService : TokenService = inject(TokenService);
    private router : Router = inject(Router);
    private categoryService = inject(CategoryService);
    private cdr = inject(ChangeDetectorRef);


    protected isLoading = true;
    protected categories: Array<{ name: string; color: string }> = [];

    ngOnInit(): void {
      this.loadCategories();
      this.cdr.detectChanges();
    }

    get isTodoRoute(): boolean {
      return this.router.url.startsWith('/todo');
    }

    private loadCategories(): void {
      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories
            .slice()
            .map((category) => ({
              name: category.name,
              color: category.color
            }));
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }

    logout() {
      this.tokenService.clearTokens();
      this.router.navigate(['/login']);
    }
}
