import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LealtadModule } from './lealtad.module';
import { FormLealtadComponent } from './form-lealtad/form-lealtad.component';
import { ContentLayoutComponent } from '../../shared/layouts/content-layout/content-layout.component';

const routes: Routes = [
  {
    path:'', 
    component: ContentLayoutComponent, 
    children: [
      { path: '', component: FormLealtadComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LealtadRoutingModule { }
