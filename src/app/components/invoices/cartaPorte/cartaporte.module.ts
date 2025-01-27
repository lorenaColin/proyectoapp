import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { cartaporteRoutingModule, } from './cartaporte-routing.module';
import { ListUbicacionesComponent } from './ubicaciones/list-ubicaciones/list-ubicaciones.component';
import { ListAutotrasporteComponent } from './autotransporte/list-autotrasporte/list-autotrasporte.component';
import { ListRemolquesComponent } from './remolques/list-remolques/list-remolques.component';
import { FormRemolquesComponent } from './remolques/form-remolques/form-remolques.component';
import { ListSegurosComponent } from './seguros/list-seguros/list-seguros.component';
import { FormSegurosComponent } from './seguros/form-seguros/form-seguros.component';
import { FormMercanciasComponent } from './mercancias/form-mercancias/form-mercancias.component';
import { ListMercanciasComponent } from './mercancias/list-mercancias/list-mercancias.component';
import { ListProductosComponent } from './productos/list-productos/list-productos.component';
import { FormProductosComponent } from './productos/form-productos/form-productos.component';
import { FormFigurasComponent } from './figuras/form-figuras/form-figuras.component';
import { ListFigurasComponent } from './figuras/list-figuras/list-figuras.component';
import { FormUbicacionesComponent } from './ubicaciones/form-ubicaciones/form-ubicaciones.component';
import { FormAutotrasporteComponent } from './autotransporte/form-autotrasporte/form-autotrasporte.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListUbicacionesComponent,
    ListAutotrasporteComponent,
    ListRemolquesComponent,
    FormRemolquesComponent,
    ListSegurosComponent,
    FormSegurosComponent,
    FormMercanciasComponent,
    ListMercanciasComponent,
    ListProductosComponent,
    FormProductosComponent,
    FormFigurasComponent,
    ListFigurasComponent,
    FormUbicacionesComponent,
    FormAutotrasporteComponent,
    
  ],
  imports: [
    CommonModule,
    cartaporteRoutingModule,
    ReactiveFormsModule,

  ]
})
export class cartaporte { }
