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

}
