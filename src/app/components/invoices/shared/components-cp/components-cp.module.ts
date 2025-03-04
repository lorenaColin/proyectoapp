import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsCpRoutingModule } from './components-cp-routing.module';
import { FormAutotrasporteComponent } from './autotrasnporte/form-autotrasporte/form-autotrasporte.component';
import { ListAutotrasporteComponent } from './autotrasnporte/list-autotrasporte/list-autotrasporte.component';
import { FormUbicacionesComponent } from './ubicaciones/form-ubicaciones/form-ubicaciones.component';
import { FormMercanciasComponent } from './mercancias/form-mercancias/form-mercancias.component';
import { FormRemolquesComponent } from './Remolques/form-remolques/form-remolques.component';
import { FormSegurosComponent } from './Seguros/form-seguros/form-seguros.component';
import { FormFigurasComponent } from './Figuras/form-figuras/form-figuras.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    // FormAutotrasporteComponent,
    // ListAutotrasporteComponent,
    // FormUbicacionesComponent,
    // FormMercanciasComponent,
    // FormRemolquesComponent,
    // FormSegurosComponent,
    // FormFigurasComponent,
  ],
  imports: [
    CommonModule,
    ComponentsCpRoutingModule,
    ReactiveFormsModule
  ]
})
export class ComponentsCpModule { }
