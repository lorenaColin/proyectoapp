import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';

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
import { DecimalsDirective } from '../../shared/directives/decimals.directive';
import { AutocompleteComponent } from '../../shared/components/autocomplete/autocomplete.component';
import { FormUbicacionesComponent } from './shared/components-cp/ubicaciones/form-ubicaciones/form-ubicaciones.component';
import { FormMercanciasComponent } from './shared/components-cp/mercancias/form-mercancias/form-mercancias.component';
import { FormAutotrasporteComponent } from './shared/components-cp/autotrasnporte/form-autotrasporte/form-autotrasporte.component';
import { FormRemolquesComponent } from './shared/components-cp/Remolques/form-remolques/form-remolques.component';
import { FormSegurosComponent } from './shared/components-cp/Seguros/form-seguros/form-seguros.component';
import { FormFigurasComponent } from './shared/components-cp/Figuras/form-figuras/form-figuras.component';
import { FormInvoiceMercanciaComponent } from './form-invoice-mercancia/form-invoice-mercancia.component';



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
    DecimalsDirective,
    AutocompleteComponent,
    FormUbicacionesComponent,
    FormMercanciasComponent,
    FormAutotrasporteComponent,
    FormRemolquesComponent,
    FormSegurosComponent,
    FormFigurasComponent,
    FormInvoiceMercanciaComponent
  ],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    ReactiveFormsModule,
    FlatpickrDirective,
    
  ],
  providers:[
    provideFlatpickrDefaults(),
    CurrencyPipe,
    DecimalPipe
  ]
})
export class InvoicesModule { }
