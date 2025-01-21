import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CartaPorteService {

  private fb = inject(FormBuilder);
  constructor() { }
    formInvoice: FormGroup = this.fb.group({
      ubicaciones: this.fb.array([]),
      mercancias: this.fb.array([]),
      autotransporte: this.fb.array([]),
      remolques: this.fb.array([]),
      seguros: this.fb.array([]),
      figuras: this.fb.array([]),
  });

  getFormCarta(): FormGroup {
    return this.formInvoice;
  }

}
