import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { FormInvoiceComponent } from './form-invoice/form-invoice.component';
import { FormInvoiceSerieComponent } from './form-invoice-serie/form-invoice-serie.component';
import { FormInvoiceProductsComponent } from './form-invoice-products/form-invoice-products.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';
import { ListComponent } from './list/list.component';



@NgModule({
  declarations: [
    InvoiceComponent,
    FormInvoiceComponent,
    FormInvoiceSerieComponent,
    FormInvoiceProductsComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    ReactiveFormsModule,
    FlatpickrDirective,
    
  ],
  providers:[
    provideFlatpickrDefaults()
  ]
})
export class InvoicesModule { }
