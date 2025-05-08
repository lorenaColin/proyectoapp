import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { companyDetailResponseInterface } from '../interfaces/companyDetail.interface';
import { invoiceDetailListResponseInterface } from '../interfaces/invoice.interface';

@Injectable({
  providedIn: 'any'
})
export class InvoicesService {
  public apiUrl = `${environment.apiUrl}/invoices`;
  public apiUrlFactura = `${environment.apiUrl}/factura`;
  public api = `${environment.apiUrl}/invoicesxml`;
  public apiUuid = `${environment.apiUrl}/obtenerUUIDs`;


  public http = inject(HttpClient);
  

  createInvoice(formulario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formulario);
  }
 getInovicebyId(uuidCompany: string): Observable<invoiceDetailListResponseInterface> {
    return this.http.get<invoiceDetailListResponseInterface>(`${this.apiUrlFactura}/${uuidCompany}`);
  }
  downloadXml(id: number): Observable<Blob> {
    return this.http.get(`${this.api}/${id}/xml`, {
      responseType: 'blob'
    });
  }
  obtenerUUIDs(): Observable<{ uuids: string[] }> {
    return this.http.get<{ uuids: string[] }>(this.apiUuid);
  }
}
