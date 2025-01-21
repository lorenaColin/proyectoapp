import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TotalsService {
  private fb = inject(FormBuilder);

  constructor() { }

  totalsForm: FormGroup = this.fb.group({
    subtotal: 0.00,
    total: 0.00,
    discount: 0.00,
    holdings: 0.00,
    taxes: 0.00,
  });

  getFormTotals(): FormGroup {
    return this.totalsForm;
  }
}
