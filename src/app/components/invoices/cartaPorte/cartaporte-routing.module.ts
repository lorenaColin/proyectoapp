import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUbicacionesComponent } from './ubicaciones/list-ubicaciones/list-ubicaciones.component';
import { ContentLayoutComponent } from '../../../shared/layouts/content-layout/content-layout.component';
import { ListAutotrasporteComponent } from './autotransporte/list-autotrasporte/list-autotrasporte.component';
import { ListRemolquesComponent } from './remolques/list-remolques/list-remolques.component';
import { ListSegurosComponent } from './seguros/list-seguros/list-seguros.component';
import { ListMercanciasComponent } from './mercancias/list-mercancias/list-mercancias.component';
import { ListProductosComponent } from './productos/list-productos/list-productos.component';
import { ListFigurasComponent } from './figuras/list-figuras/list-figuras.component';

const routes: Routes = [
  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      { path: 'ubicaciones', component: ListUbicacionesComponent },
      { path: 'autotrasporte', component: ListAutotrasporteComponent },
      { path: 'figuras', component: ListFigurasComponent },
      { path: 'remolques', component: ListRemolquesComponent },
      { path: 'seguros', component: ListSegurosComponent},
      { path: 'mercancias', component: ListMercanciasComponent},
      { path: 'productos', component: ListProductosComponent},
      { path: '**', redirectTo: 'ubicaciones' }, 
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class cartaporteRoutingModule { }
