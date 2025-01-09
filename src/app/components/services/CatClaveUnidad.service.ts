import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { CompanyListResponseInterface, CompanyInterface, CompanyResponseInterface } from '../interfaces/company.interface';

@Injectable({
  providedIn: 'any'
})
export class cat_Clave_Unidad {
    private apiUrl = 'http://127.0.0.1:8000/api/searchClavUnidad'; 

    constructor(private http: HttpClient) {}

    searchClavUnidad(termino: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}?termino=${termino}`);
    }
    

}
