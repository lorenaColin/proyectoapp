import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LealtadRoutingModule } from './lealtad-routing.module';
import { FormLealtadComponent } from './form-lealtad/form-lealtad.component';


@NgModule({
  declarations: [
    FormLealtadComponent
  ],
  imports: [
    CommonModule,
    LealtadRoutingModule
  ]
})
export class LealtadModule { }
