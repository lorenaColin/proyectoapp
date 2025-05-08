import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HerramientasRoutingModule } from './herramientas-routing.module';
import { FormHerramientasComponent } from './form-herramientas/form-herramientas.component';


@NgModule({
  declarations: [
    FormHerramientasComponent
  ],
  imports: [
    CommonModule,
    HerramientasRoutingModule
  ]
})
export class HerramientasModule { }
