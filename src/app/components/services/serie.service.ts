import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { CompanyListResponseInterface, CompanyInterface, CompanyResponseInterface } from '../interfaces/company.interface';
import { SerietInterface, SerietListResponseInterface, SerietResponseInterface } from '../interfaces/series.interface';

@Injectable({
  providedIn: 'any'
})
export class series {


  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/serie`;

  getAllSeries(): Observable<SerietListResponseInterface> {
    return this.http.get<SerietListResponseInterface>(this.apiUrl);
  }
  createSeries(series: SerietInterface): Observable<SerietResponseInterface> {
    return this.http.post<SerietResponseInterface>(this.apiUrl, series);
  }
  getSeriesById(id: number): Observable<SerietResponseInterface> {
    return this.http.get<SerietResponseInterface>(`${this.apiUrl}/${id}`);
  }
  updateSeries(id: number, series: SerietInterface): Observable<SerietResponseInterface> {
    return this.http.put<SerietResponseInterface>(`${this.apiUrl}/${id}`, series);
  }

  // Eliminar un series
  deleteSeries(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
