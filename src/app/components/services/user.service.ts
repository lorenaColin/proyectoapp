import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { codeUserFormInterface, CodeUserResponseInterface, UserFormInterface, UserResponseInterface } from '../interfaces/user.interface';
import { environment } from '../../../environments/environments';

@Injectable({
    providedIn: 'any'
})
export class UserService {

    constructor(
        private http: HttpClient
    ){}
    private apiUrl = `${environment.apiUrl}`;
    private urlUsers = `${environment.apiUrl}/users`;

    createUser(userForm:UserFormInterface ): Observable<UserResponseInterface> {
        return this.http.post<UserResponseInterface>(this.urlUsers, userForm);
    }

    getCodeUser(): Observable<CodeUserResponseInterface> {
        return this.http.get<CodeUserResponseInterface>(`${this.apiUrl}/resendcode`);
    }

    
    
}