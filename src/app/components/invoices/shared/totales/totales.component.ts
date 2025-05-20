import { Component, inject } from '@angular/core';
import { TotalsService } from '../../../services/totals.service';

@Component({
  selector: 'app-totales',
  templateUrl: './totales.component.html',
  styleUrl: './totales.component.scss'
})
export class TotalesComponent {
  private totalsService = inject(TotalsService);
  totalsForm = this.totalsService.getFormTotals();

  ngOnDestroy(): void {
    this.totalsForm.reset({
      subtotal: '0.00',
      total: '0.00',
      descuento: '0.00',
      retenciones: '0.00',
      traslados: '0.00',
    });
  }
}
