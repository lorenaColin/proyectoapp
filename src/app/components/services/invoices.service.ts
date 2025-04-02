import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'any'
})
export class InvoicesService {
  public apiUrl = `${environment.apiUrl}/invoices`;
  public http = inject(HttpClient);
  

  createInvoice(formulario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formulario);
  }

}
