import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AuthService } from '../../components/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  private isAlertShown: boolean = false;
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAuthToken();
  
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });  
    }
  
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401 && !this.authService.isSessionExpiredState() && !this.isAlertShown) {
          this.isAlertShown = true;
          this.authService.setSessionExpired(true);
  
          swal.fire("Sesión expirada INTERCEPTOR", "Tu sesión ha caducado, por favor inicia sesión nuevamente.", "warning")
            .then(() => {
              this.authService.logout();
              this.router.navigate(['auth/login']).then(() => {
                this.authService.setSessionExpired(false);
                this.isAlertShown = false;
              });
            });
        }
        return throwError(err);
      })
    );
  }
}
