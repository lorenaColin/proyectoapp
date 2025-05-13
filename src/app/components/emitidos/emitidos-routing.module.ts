import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from '../../shared/layouts/content-layout/content-layout.component';
import { FormEmitidosComponent } from './form-emitidos/form-emitidos.component';
import { FormEmitidosCPComponent } from './form-emitidos-cp/form-emitidos-cp.component';
const routes: Routes = [
  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      { path: 'cfdi', component: FormEmitidosComponent },
      { path: 'cp', component: FormEmitidosCPComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmitidosRoutingModule { }
