import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmitidosRoutingModule } from './emitidos-routing.module';
import { FormEmitidosComponent } from './form-emitidos/form-emitidos.component';
import { FormEmitidosCPComponent } from './form-emitidos-cp/form-emitidos-cp.component';


@NgModule({
  declarations: [
    FormEmitidosComponent,
    FormEmitidosCPComponent
  ],
  imports: [
    CommonModule,
    EmitidosRoutingModule
  ]
})
export class EmitidosModule { }
