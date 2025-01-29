import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { FormInvoicePagosComponent } from './components/invoices/form-invoice-pagos/form-invoice-pagos.component';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    
    // FormInvoicePagosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    // provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
