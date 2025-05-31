import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable, throwError, Subscription, interval } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import {
  AuthResponse,
  TokenRefreshResponseInterface,
  UserResponseInterface,
  VerifyCodeResponseInterface,
} from '../interfaces/auth.interface';
import { Router } from '@angular/router';
import { IdleService } from './idle.service.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'any',
})
export class AuthService {
  private isLoggingOut: boolean = false;
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;
  private router = inject(Router);
  private isTokenRenewing = false;
  private token: string | null = null;
  private tokenRenewalSubscription: Subscription | null = null;

  //   private idleService: IdleService;
  constructor(private idleService: IdleService) {
    this.idleService.inactivity$.subscribe(() => {
      this.logout();
    });

    this.startTokenRenewalTimer();
  }
  

  getNombreUsuario(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log('Nombre extraído del token:', decoded.name);  // <---
        return decoded.name || null;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }
  
  private startTokenRenewalTimer(): void {
    if (this.tokenRenewalSubscription) {
      // console.warn('El timer ya está a ctivo, no se inicializará de nuevo.');
      return;
    }

    // console.log('Inicializando startTokenRenewalTimer');
    this.tokenRenewalSubscription = interval(1 * 60 * 1000).subscribe(() => {
      // console.log('Interval ejecutado');
      // this.checkTokenExpiry();
    });
  }
  // getUuid(): string | null {
  //   const token = this.getToken();
  //   if (token) {
  //     try {
  //       const decoded: any = jwtDecode(token);
  //       return decoded.company_uuid || null;
  //     } catch (error) {
  //       console.error('Error decoding token:', error);
  //       return null;
  //     }
  //   }
  //   return null;
  // }
  // getUuid(): string | null {
  //   const token = this.getToken();
  //   if (token) {
  //     try {
  //       const decoded: any = jwtDecode(token);
  //       console.log('Token decodificado:', decoded);  // Verifica el contenido del token
  //       return decoded.company_uuid || null;
  //     } catch (error) {
  //       console.error('Error decoding token:', error);
  //       return null;
  //     }
  //   }
  //   return null;
  // }
  
  login(email: string, password: string): Observable<UserResponseInterface> {
    return this.http
      .post<UserResponseInterface>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.isLoggingOut = false;
            this.idleService.startWatching();
            console.log(this.getToken);
          }
        })
      );
  }
  getUuid(): string | null {
    return localStorage.getItem('company');
  }
  
  
  verifyCode(code: string): Observable<VerifyCodeResponseInterface> {
    return this.http.post<VerifyCodeResponseInterface>(
      `${this.apiUrl}/verifycode/`,
      { code }
    );
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
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
        this.isSessionExpired = false;
      },
      (error) => {
        // console.error('Error al intentar hacer logout:', error);
        if (error.status === 401) {
          console.warn(
            // 'El token ya no es válido o no existe. Finalizando sesión.'
          );
          this.finalizeLogout();
          this.isSessionExpired = false;
        } else {
          this.isLoggingOut = false;
          this.isSessionExpired = false;
        }
      }
    );
  }

  private stopTokenRenewalTimer(): void {
    // console.log("stopTokenRenewalTimer");
    if (this.tokenRenewalSubscription) {
      this.tokenRenewalSubscription.unsubscribe();
      this.tokenRenewalSubscription = null;
    }
  }

  private finalizeLogout(): void {
    this.removeTokens();
    this.stopTokenRenewalTimer();
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

  // checkTokenExpiry() {
  //   // console.log('checkTokenExpiry');
  //   if (this.isTokenRenewing) return;

  //   const token = this.getToken();
  //   if (!token) return;

  //   const decoded: any = jwtDecode(token);
  //   const currentTime = Date.now() / 1000;

  //   if (decoded.exp - currentTime < 60) {
  //     // console.log('Token está por expirar, intentando renovar...');
  //     this.isTokenRenewing = true;
  //     this.renewToken().subscribe({
  //       next: () => {
  //         // console.log('Token renovado');
  //         this.isTokenRenewing = false;
  //       },
  //       error: (err) => {
  //         // console.log('Error al renovar el token', err);
  //         this.isTokenRenewing = false;
  //       },
  //     });
  //   }
  // }

  renewToken(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      // console.log('Token no disponible para renovar');
      return throwError('Token no disponible');
    }

    return this.http
      .post(
        `${this.apiUrl}/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        tap((response: any) => {
          // console.log('Respuesta del servidor:', response); 
          if (response.token) {
            // console.log('Seteando el nuevo token:', response.token); 
            this.setToken(response.token);
          } else {
            // console.warn('No se encontró un token en la respuesta');
          }
        }),
        catchError((err) => {
          // console.error('Error al renovar el token:', err);
          this.logout();
          return throwError(err);
        })
      );
  }
  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  setToken(token: string): void {
    // console.log('Token recibido en setToken:', token);
    this.token = token;
    localStorage.setItem('token', token);
  }
}
