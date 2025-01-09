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
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe(() => {
      this.removeTokens();
      this.idleService.stopWatching();
      this.router.navigate(['auth/login']);
      // this.isLoggingOut = false;
    });
  }

  removeTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
}
