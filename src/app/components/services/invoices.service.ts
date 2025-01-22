import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'any'
})
export class InvoicesService {
  // private fb = inject(FormBuilder);

  constructor(private http: HttpClient) {
  
  }

  // formInvoice: FormGroup = this.fb.group({
  //   tipo_comprobante: '',
  //   serie_folio: '',
  //   fecha: '',
  //   regimen_emisor: '',
  //   receptor: '',
  //   uso_cfdi: '',
  //   conceptos: this.fb.array([]),
  //   totales: this.fb.group({
  //     subtotal: 0,
  //     descuento: 0,
  //     impuesto: 0,
  //     retenciones: 0,
  //     total: 0
  //   }),  
  // });


  //  getFormInvoice(): FormGroup {
  //   return this.formInvoice;
  // }
}
