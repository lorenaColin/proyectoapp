import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { CompanyListResponseInterface, CompanyInterface, CompanyResponseInterface } from '../interfaces/company.interface';
import { SerietInterface, SerietListResponseInterface, SerietResponseInterface } from '../interfaces/series.interface';
import { remolquesInterface, remolquesListResponseInterface, remolquesResponseInterface } from '../interfaces/remolques.interface';

@Injectable({
  providedIn: 'any'
})
export class remolquesService {


  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/remolques`;
  private catRemolquesURL = `${environment.apiUrl}/catRemolques`;
  getAllRemolques(): Observable<remolquesListResponseInterface> {
    return this.http.get<remolquesListResponseInterface>(this.apiUrl);
  }
  createRemolques(series: remolquesInterface): Observable<remolquesResponseInterface> {
    return this.http.post<remolquesResponseInterface>(this.apiUrl, series);
  }
  getRemolquesById(id: number): Observable<remolquesResponseInterface> {
    return this.http.get<remolquesResponseInterface>(`${this.apiUrl}/${id}`);
  }
  updateRemolques(id: number, series: SerietInterface): Observable<remolquesResponseInterface> {
    return this.http.put<remolquesResponseInterface>(`${this.apiUrl}/${id}`, series);
  }

  deleteRemolques(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
//   getremolques(): Observable<string[]> {
//     return this.http.get<string[]>(this.catRemolquesURL); 
// }
getremolques(): Observable<{ Clave: string; descripcion: string }[]> {
  return this.http.get<{ Clave: string; descripcion: string }[]>(this.catRemolquesURL);
}

}
