import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import {
  CompanyListResponseInterface,
  CompanyInterface,
  CompanySeals,
} from '../interfaces/company.interface';

@Injectable({
  providedIn: 'any',
})
export class CompanyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/companies`;

  listCompany(): Observable<CompanyListResponseInterface> {
    return this.http.get<CompanyListResponseInterface>(this.apiUrl);
  }

  createCompany(
    form: CompanyInterface
  ): Observable<CompanyListResponseInterface> {
    return this.http.post<CompanyListResponseInterface>(this.apiUrl, form);
  }

  getCompanyById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  loadSeals(formData: FormData) :Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/loadSeals`, formData);
  }
}
