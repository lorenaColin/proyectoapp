import { Component, inject, OnInit } from '@angular/core';
import { InvoicesService } from '../../services/invoices.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormaPagoService } from '../../services/forma-pago.service';
import { ConceptsService } from '../../services/concepts.service';
import { TotalsService } from '../../services/totals.service';

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
  formaPagoForm = this.formaPagoService.getFormFormaPago();
  totalsForm = this.totalsService.getFormTotals();
  mostrarCP: boolean = false;
  typeProof: string = 'I';

  constructor() {}

  formIngreso: FormGroup = this.fb.group({
    invoice_type: 'I',
    serie_folio: '',
    fecha: '',
    regimen_emisor: '',
    receptor: '',
    uso_cfdi: '',
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
  }
}
