import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './shared/navbar/navbar';
import {AuthService} from './services/auth/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private authService = inject(AuthService);

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
