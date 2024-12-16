import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { CompanyInterface, CompanyListResponseInterface, CompanyResponseInterface } from '../interfaces/company.interface';

@Injectable({
  providedIn: 'any'
})
export class CompanyService {


  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  listCompany(): Observable<CompanyResponseInterface>{
    return this.http.get<CompanyResponseInterface>(`${this.apiUrl}/companies`);
  }

  createCompany(form: CompanyInterface): Observable<CompanyListResponseInterface> {
    return this.http.post<CompanyListResponseInterface>(`${this.apiUrl}/companies`, form);
  }

}
