import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../components/services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getAuthToken();
  const authReq = req.clone({
    setHeaders: { 
      Authorization: `Bearer ${ token }`
    }
  });
  return next(authReq);
  // return next(authReq).pipe(
  //   catchError((err) => {
  //     return authService.refreshToken().pipe(
  //       switchMap((res) => {
  //         localStorage.setItem('refreshToken', res.accessToke)
  //         const newReq = req.clone({
  //           setHeaders: { 
  //             Authorization: `Bearer ${ token }`
  //           }
  //         });
  //       }),
  //       catchError((refreshErr) => {
  //         const finalError = new Error(refreshErr);

  //         localStorage.removeItem('token');
  //         localStorage.removeItem('refreshToken');

  //         return throwError(() => finalError);
  //       })
  //     )
  //   })
  // );
};
