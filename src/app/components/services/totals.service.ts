import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ConceptsService } from './concepts.service';

@Injectable({
  providedIn: 'root'
})
export class TotalsService {
  private fb = inject(FormBuilder);
  private conceptsService = inject(ConceptsService);
  formConcepts  = this.conceptsService.getProductosFormArray(); 
  constructor() { }

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

  calculateTotals(): void {
    let totalSum = 0;
  
    this.formConcepts.controls.forEach((control: AbstractControl) => {
      (control.value.total_product) ? totalSum += control.value.total_product : '';
      
    });
  
    this.totalsForm.patchValue({
      total: totalSum, 
    });
  
  }
  
}
