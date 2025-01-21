import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {
  private fb = inject(FormBuilder);
  constructor() { }
  
  formaPagoForm: FormGroup = this.fb.group({
    metodo_pago: '',
    forma_pago: '',
    moneda: '',
    tipo_cambio: '',
    condiciones: '',
    fecha_vencimiento: ''
  });


   getFormFormaPago(): FormGroup {
    return this.formaPagoForm;
  }
}
