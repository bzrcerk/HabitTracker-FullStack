import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {TokenService} from '../auth/token-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  const hasToken = tokenService.hasToken();

  if (hasToken) {
    return true;
  }

  return router.navigate(['login']);
};
