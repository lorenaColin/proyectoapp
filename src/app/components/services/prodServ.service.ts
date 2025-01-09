import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { CompanyListResponseInterface, CompanyInterface, CompanyResponseInterface } from '../interfaces/company.interface';

@Injectable({
  providedIn: 'any'
})
export class prodServ {
    private apiUrl = 'http://127.0.0.1:8000/api/searchClavProdSer'; 

    constructor(private http: HttpClient) {}

    searchClavProdSer(termino: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}?termino=${termino}`);
    }
    

}
