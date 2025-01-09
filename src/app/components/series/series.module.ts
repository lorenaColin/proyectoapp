import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesRoutingModule } from './series-routing.module';
import { ListComponent } from './list/list.component';
import { FormSeriesComponent } from './form-series/form-series.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ListComponent,
    FormSeriesComponent
  ],
  imports: [
    CommonModule,
    SeriesRoutingModule,
    ReactiveFormsModule,
  FormsModule,
    NgSelectModule

  ]
})
export class SeriesModule { }
