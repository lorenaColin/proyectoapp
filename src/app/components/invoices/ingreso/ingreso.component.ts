import { Component, inject, OnInit } from '@angular/core';
import { InvoicesService } from '../../services/invoices.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormaPagoService } from '../../services/forma-pago.service';
import { ConceptsService } from '../../services/concepts.service';
import { TotalsService } from '../../services/totals.service';
import { ValidatorsService } from '../../../shared/services/validators.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrl: './ingreso.component.scss'
})
export class IngresoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private formaPagoService = inject(FormaPagoService);
  private totalsService = inject(TotalsService);
  private conceptsService = inject(ConceptsService);
  private validatorsService = inject(ValidatorsService);
  formaPagoForm = this.formaPagoService.getFormFormaPago();
  totalsForm = this.totalsService.getFormTotals();
  mostrarCP: boolean = false;
  typeProof: string = 'I';

  constructor() {}

  formIngreso: FormGroup = this.fb.group({
    invoice_type: ['I', [Validators.required]],
    serie_folio: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    regimen_emisor: ['', [Validators.required]],
    receptor: ['', [Validators.required]],
    uso_cfdi: ['', [Validators.required]],
    ...this.formaPagoForm.controls,
    ...this.totalsForm.controls,
    concepts: this.conceptsService.getProductosFormArray(),
  });

  agregarCartaP(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked; 
    this.mostrarCP = isChecked; 
    console.log('Checkbox is:', isChecked ? 'Checked' : 'Unchecked');
  }

  ngOnInit(): void {

  }

  onSubmitIngreso() {
    console.log('Ingreso');
    if (this.formIngreso.invalid) {
      this.formIngreso.markAllAsTouched();    
      return;
    }
    console.log(this.formIngreso.value);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.formIngreso, field);
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField( this.formIngreso, field );
  }
  
}
