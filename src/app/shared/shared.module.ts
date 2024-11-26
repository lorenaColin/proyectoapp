import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimplebarAngularModule } from 'simplebar-angular';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HoverEffectSidebarDirective } from './directives/hover-effect-sidebar.directive';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SwitcherComponent } from './components/switcher/switcher.component';
import { TabToTopComponent } from './components/tab-to-top/tab-to-top.component';
import { AuthenticationLayoutComponent } from './layouts/authentication-layout/authentication-layout.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent, 
    SwitcherComponent,
    TabToTopComponent,
    AuthenticationLayoutComponent,
    ContentLayoutComponent,
    HoverEffectSidebarDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SimplebarAngularModule,
    ColorPickerModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    AuthenticationLayoutComponent,
    ContentLayoutComponent,
    HoverEffectSidebarDirective,
  ],
  providers:[
    ColorPickerService
  ],
})
export class SharedModule { }
