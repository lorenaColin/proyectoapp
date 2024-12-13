import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts/accounts/accounts.component';
import { AdministrationLayoutComponent } from '../../shared/layouts/administration-layout/administration-layout.component';

const routes: Routes = [
  { 
    path: '',
    component: AdministrationLayoutComponent,
    children: [
      { path: '', component: AccountsComponent },
      { path: '**', redirectTo: ''}
    ]  
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
