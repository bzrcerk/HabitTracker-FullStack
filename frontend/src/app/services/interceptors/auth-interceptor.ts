import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const skipAuthHeader =
    req.url.includes('/api/token/') ||
    req.url.includes('/api/register/') ||
    req.url.includes('/api/token/refresh/');

  if (skipAuthHeader) {
    return next(req);
  }

  const token = localStorage.getItem('access');

  if (!token) {
    return next(req);
  }

  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedReq);
};
