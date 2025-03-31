import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TotalsService {
  private fb = inject(FormBuilder);
  totalsForm: FormGroup = this.fb.group({
    subtotal: 0.00,
    total: 0.00,
    descuento: 0.00,
    retenciones: 0.00,
    traslados: 0.00,
  });

  getFormTotals(): FormGroup {
    return this.totalsForm;
  }
}
