import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import {
  InsuranceInterface,
  InsuranceListInterface,
  InsuranceResponseInterface,
} from '../interfaces/insurance.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class InsuranceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/insurances`;

  createInsurance(
    insurance: InsuranceInterface
  ): Observable<InsuranceResponseInterface> {
    return this.http.post<InsuranceResponseInterface>(this.apiUrl, insurance);
  }

  getInsurance(): Observable<InsuranceListInterface> {
    return this.http.get<InsuranceListInterface>(this.apiUrl);
  }

  getInsuranceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateInsurance(
    id: number,
    formData: InsuranceInterface
  ): Observable<InsuranceResponseInterface> {
    return this.http.put<InsuranceResponseInterface>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }
}
