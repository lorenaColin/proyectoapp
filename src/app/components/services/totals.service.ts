import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { totalsInterface } from '../interfaces/totals.interface';

@Injectable({
  providedIn: 'root'
})
export class TotalsService {
  private fb = inject(FormBuilder);
  public formulario: FormGroup = {} as FormGroup;
  totalsForm: FormGroup = this.fb.group({
    subtotal: '0.00',
    total: '0.00',
    descuento: '0.00',
    retenciones: '0.00',
    traslados: '0.00',
  });

  setForm(formulario: FormGroup) {
    this.formulario = formulario
  }
  setValueTotals(data: totalsInterface){
    this.formulario.patchValue(data);
  }

  getFormTotals(): FormGroup {
    return this.totalsForm;
  }
}
