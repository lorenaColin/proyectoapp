import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { UserResponseInterface, VerifyCodeResponseInterface } from '../interfaces/auth.interface';


@Injectable({
    providedIn: 'any'
})
export class AuthService {

    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}`;

    login(email: string, password: string): Observable<UserResponseInterface> {
        return this.http.post<UserResponseInterface>(`${this.apiUrl}/login`, { email, password });
    }

    verifyCode(code: string, ): Observable<VerifyCodeResponseInterface>{
        return this.http.post<VerifyCodeResponseInterface>(`${this.apiUrl}/verifycode/`, {code});
    }

    
    getAuthToken() {
        return localStorage.getItem('token') || '';
    }




}