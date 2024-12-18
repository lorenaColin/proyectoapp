import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { CompanyListResponseInterface, CompanyInterface, CompanyResponseInterface } from '../interfaces/company.interface';

@Injectable({
  providedIn: 'any'
})
export class CompanyService {


  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  listCompany(): Observable<CompanyListResponseInterface>{
    return this.http.get<CompanyListResponseInterface>(`${this.apiUrl}/companies`);
  }

  createCompany(form: CompanyInterface): Observable<CompanyResponseInterface> {
    return this.http.post<CompanyResponseInterface>(`${this.apiUrl}/companies`, form);
  }

}
