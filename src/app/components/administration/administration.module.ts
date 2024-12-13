import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AccountsComponent } from './accounts/accounts/accounts.component';
import { CompanyFormComponent } from './accounts/company-form/company-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AccountsComponent,
    CompanyFormComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AdministrationModule { }
