import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component';
import { ContentLayoutComponent } from '../../shared/layouts/content-layout/content-layout.component';
import { ListComponent } from './list/list.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { TrasladoComponent } from './traslado/traslado.component';

const routes: Routes = [
  {
    path:'', 
    component: ContentLayoutComponent, 
    children:[
      { path: 'create-invoice', component: InvoiceComponent },
      { path: 'ingreso', component: IngresoComponent },
      { path: 'egreso', component: IngresoComponent },
      // { path: 'nomina', component: IngresoComponent },
      // { path: 'pago', component: IngresoComponent },
      { path: 'traslado', component: TrasladoComponent },
      { path: 'list', component: ListComponent },
      { path: '**', redirectTo: 'list'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
