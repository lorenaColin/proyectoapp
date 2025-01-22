import { Component, inject } from '@angular/core';
import { TotalsService } from '../../services/totals.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConceptsService } from '../../services/concepts.service';

@Component({
  selector: 'app-traslado',
  templateUrl: './traslado.component.html',
  styleUrls: ['./traslado.component.scss']
})
export class TrasladoComponent {
  private fb = inject(FormBuilder);
  mostrarCP: boolean = false;
  private totalsService = inject(TotalsService);
  totalsForm = this.totalsService.getFormTotals();
  private conceptsService = inject(ConceptsService);
  typeProof: string = 'T';
  constructor() {
    // this.formTraslado.patchValue({
    //   subtotal: 6.200, 
    //   total: 10.500,   
    // });
  }

  formTraslado: FormGroup = this.fb.group({
    invoice_type: 'T',
    serie: '',
    folio: '',
    date: '',
    regimen_emisor: '',
    receptor: '',
    uso_cfdi: '',
    currency: 'XXX',
    // exportacion: '01', ??
    // lugar_expedicion: '42501', ??
    ...this.totalsForm.controls,
    // subtotal: this.totalsService.getFormTotals().get('subtotal')?.value(6.200),
    concepts: this.conceptsService.getProductosFormArray(),
  });

  agregarCartaP(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked; 
    this.mostrarCP = isChecked; 
    console.log('Checkbox is:', isChecked ? 'Checked' : 'Unchecked');
  }

  onSubmitTraslado() {
    console.log('Traslado');
  }
}
