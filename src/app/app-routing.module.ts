import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationLayoutComponent } from './shared/layouts/authentication-layout/authentication-layout.component';
import { ContentLayoutComponent } from './shared/layouts/content-layout/content-layout.component';

const routes: Routes = [
  { path: '', component: AuthenticationLayoutComponent, pathMatch: 'full' },
  { path: 'dashboard', component: ContentLayoutComponent },
  { path: '**', redirectTo:'' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
