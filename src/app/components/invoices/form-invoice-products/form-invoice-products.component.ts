import { Component } from '@angular/core';

@Component({
  selector: 'app-form-invoice-products',
  templateUrl: './form-invoice-products.component.html',
  styleUrl: './form-invoice-products.component.scss'
})
export class FormInvoiceProductsComponent {
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
