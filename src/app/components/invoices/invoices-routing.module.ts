import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component';
import { ContentLayoutComponent } from '../../shared/layouts/content-layout/content-layout.component';

const routes: Routes = [
  {
    path:'', 
    component: ContentLayoutComponent, 
    children:[
      { path: 'invoices', component: InvoiceComponent },
      { path: '**', redirectTo: 'invoices'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
