import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from '../../shared/layouts/content-layout/content-layout.component';
import { FormHerramientasComponent } from './form-herramientas/form-herramientas.component';

const routes: Routes = [
  {
    path:'', 
    component: ContentLayoutComponent, 
    children: [
      { path: '', component: FormHerramientasComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HerramientasRoutingModule { }
