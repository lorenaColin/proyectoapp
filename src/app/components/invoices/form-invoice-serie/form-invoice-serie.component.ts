import { Component } from '@angular/core';

@Component({
  selector: 'app-form-invoice-serie',
  templateUrl: './form-invoice-serie.component.html',
  styleUrl: './form-invoice-serie.component.scss'
})
export class FormInvoiceSerieComponent {
  currentTab: number = 1; 

  

  closeModal() {
    const modal = document.getElementById('hs-extralarge-modal3');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  isTableActive: boolean = true; 
  isCreateActive: boolean = false; 

  selectTab(isTable: boolean): void {
    this.isTableActive = isTable;
    this.isCreateActive = !isTable;
  }
}
