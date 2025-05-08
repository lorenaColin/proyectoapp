import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import {
  CompanyListResponseInterface,
  CompanyInterface,
  CompanySeals,
  CompanyResponseInterface,
} from '../interfaces/company.interface';
import { companyDetailInterface, companyDetailResponseInterface } from '../interfaces/companyDetail.interface';

@Injectable({
  providedIn: 'any',
})
export class CompanyDetailService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/companiesDetail`;

 
  getetailById(id: string): Observable<companyDetailResponseInterface> {
    return this.http.get<companyDetailResponseInterface>(`${this.apiUrl}/${id}`);
  }

}
