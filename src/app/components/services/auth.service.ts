import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable, tap } from 'rxjs';
import {
  AuthResponse,
  TokenRefreshResponseInterface,
  UserResponseInterface,
  VerifyCodeResponseInterface,
} from '../interfaces/auth.interface';
import { Router } from '@angular/router';
import { IdleService } from './idle.service.service';

@Injectable({
  providedIn: 'any',
})
export class AuthService {
  private isLoggingOut: boolean = false;
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;
  private router = inject(Router);
  //   private idleService: IdleService;
  constructor(private idleService: IdleService) {
    this.idleService.inactivity$.subscribe(() => {
      this.logout();
    });
  }
  login(email: string, password: string): Observable<UserResponseInterface> {
    return this.http
      .post<UserResponseInterface>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.isLoggingOut = false;
            this.idleService.startWatching();
          }
        })
      );
  }

  verifyCode(code: string): Observable<VerifyCodeResponseInterface> {
    return this.http.post<VerifyCodeResponseInterface>(
      `${this.apiUrl}/verifycode/`,
      { code }
    );
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh`, {});
  }

  logout(): void {
    console.log('servicio');
    if (this.isLoggingOut) return;

    this.isLoggingOut = true;
    const token = localStorage.getItem('token');
    if (!token) {
      this.finalizeLogout();
      return;
    }
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe(
      () => {
        this.finalizeLogout();
      },
      (error) => {
        // console.error('Error al intentar hacer logout:', error);
        if (error.status === 401) {
          // console.warn('El token ya no es válido o no existe. Finalizando sesión.');
          this.finalizeLogout();
        } else {
          this.isLoggingOut = false;
        }
      }
    );
  }
  private finalizeLogout(): void {
    this.removeTokens();
    // this.stopTokenRenewalTimer();
    this.idleService.stopWatching();
    this.router.navigate(['auth/login']);
    this.isLoggingOut = false;
  }
  removeTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  private isSessionExpired = false;

  setSessionExpired(value: boolean) {
    this.isSessionExpired = value;
  }

  isSessionExpiredState() {
    return this.isSessionExpired;
  }
}
