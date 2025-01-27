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
import { FormInvoicePagosComponent } from './form-invoice-pagos/form-invoice-pagos.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { TrasladoComponent } from './traslado/traslado.component';
import { DatosCfdiComponent } from './shared/datos-cfdi/datos-cfdi.component';
import { ConceptosComponent } from './shared/conceptos/conceptos.component';
import { TotalesComponent } from './shared/totales/totales.component';
import { ComplementoCpComponent } from './shared/complemento-cp/complemento-cp.component';
import { FormaPagoComponent } from './shared/forma-pago/forma-pago.component';
import { EgresoComponent } from './egreso/egreso.component';
import { RelatedsComponent } from './shared/relateds/relateds.component';



@NgModule({
  declarations: [
    InvoiceComponent,
    FormInvoiceComponent,
    FormInvoiceSerieComponent,
    FormInvoiceProductsComponent,
    ListComponent,
    FormInvoicePagosComponent,
    IngresoComponent,
    TrasladoComponent,
    DatosCfdiComponent,
    ConceptosComponent,
    TotalesComponent,
    ComplementoCpComponent,
    FormaPagoComponent,
    EgresoComponent,
    RelatedsComponent,
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
