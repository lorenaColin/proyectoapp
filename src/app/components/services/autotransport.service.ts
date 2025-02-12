import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import {
  AutotransportInterface,
  AutotransportListInterface,
  AutotransportResponseInterface,
} from '../interfaces/autotransport.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class AutotransportService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/autotransports`;

  createAutotransport(
    autotransport: AutotransportInterface
  ): Observable<AutotransportResponseInterface> {
    return this.http.post<AutotransportResponseInterface>(
      this.apiUrl,
      autotransport
    );
  }

  getAutotransports(): Observable<AutotransportListInterface> {
    return this.http.get<AutotransportListInterface>(this.apiUrl);
  }

  getAutotransportById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateAutotransport(
    id: number,
    formData: AutotransportInterface
  ): Observable<AutotransportResponseInterface> {
    return this.http.put<AutotransportResponseInterface>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }

  getConfigVehicular(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/config`); 

  } 
  getPermisos(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/permis`); 
  }

}
