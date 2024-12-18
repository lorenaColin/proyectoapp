import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { TokenRefreshResponseInterface, UserResponseInterface, VerifyCodeResponseInterface } from '../interfaces/auth.interface';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'any'
})
export class AuthService {

    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}`;
    private router = inject(Router);

    login(email: string, password: string): Observable<UserResponseInterface> {
        return this.http.post<UserResponseInterface>(`${this.apiUrl}/login`, { email, password });
    }

    verifyCode(code: string): Observable<VerifyCodeResponseInterface>{
        return this.http.post<VerifyCodeResponseInterface>(`${this.apiUrl}/verifycode/`, {code});
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
    console.log("servicio")
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe(
        () => {
            this.removeTokens();
            // this.idleService.stopWatching();
            this.router.navigate(['auth/login']);
            // this.isLoggingOut = false;
        });
        
    }

    removeTokens(){
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }


}