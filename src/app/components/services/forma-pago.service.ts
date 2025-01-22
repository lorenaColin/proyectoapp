import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {
  private fb = inject(FormBuilder);
  constructor() { }
  
  formaPagoForm: FormGroup = this.fb.group({
    metodo_pago: ['', [Validators.required]],
    forma_pago: ['', [Validators.required]],
    moneda: ['MXN', [Validators.required]],
    tipo_cambio: ['', [Validators.required]],
    condiciones: ['', [Validators.required]],
    // fecha_vencimiento: ['', [Validators.required]]
  });


   getFormFormaPago(): FormGroup {
    return this.formaPagoForm;
  }
}
