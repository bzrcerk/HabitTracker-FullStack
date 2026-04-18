import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TokenService} from '../../services/auth/token-service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
    private tokenService : TokenService = inject(TokenService);
    private router : Router = inject(Router);

    logout() {
      this.tokenService.clearTokens();
      this.router.navigate(['/login']);
    }
}
