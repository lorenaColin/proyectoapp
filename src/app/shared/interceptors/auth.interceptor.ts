import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../components/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getAuthToken();
  const authReq = req.clone({
    setHeaders: { 
      Authorization: `Bearer ${ token }`
    }
  });

  return next(authReq);
};
