import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../components/services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn  = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getAuthToken();
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(authReq);
  /*
  return next(authReq).pipe(
    catchError((err) => {
      return authService.refreshToken().pipe(
        switchMap((res) => {
          // Guardar el nuevo token
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('refreshToken', res.access_token);

          const newReq = req.clone({
            setHeaders: {
               Authorization: `Bearer ${res.access_token}`
            }
          });

          return next(newReq);
        }),
        catchError((refreshErr) => {
          console.log(":(")
          const finalError = new Error(refreshErr);

          // localStorage.removeItem('token');
          // localStorage.removeItem('refreshToken');

          return throwError(() => finalError);
        })
      )
    })
  );
  */
};
