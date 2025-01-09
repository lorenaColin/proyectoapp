import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  AuthInterceptor,
} from '../../shared/interceptors/auth.interceptor';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    VerifyEmailComponent,
    LoginComponent,
    ResetPasswordComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  // providers: [
  //   provideHttpClient(withInterceptorsFromDi()),
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: AuthInterceptor,
  //     multi: true,
  //   },
  // ],
})
export class AuthenticationModule {}
