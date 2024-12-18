import { Component } from '@angular/core';

@Component({
  selector: 'app-form-invoice',
  templateUrl: './form-invoice.component.html',
  styleUrl: './form-invoice.component.scss'
})
export class FormInvoiceComponent {
  currentTab: number = 1; 

  

  closeModal() {
    const modal = document.getElementById('hs-extralarge-modal1');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  selectedTab: string = 'tabla'; 
  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}
