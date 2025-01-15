import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { AuthService } from '../../services/auth.service';
import { PATRON_EMAIL } from '../../../shared/utils/expressions';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private validatorsService = inject(ValidatorsService)
  private authService = inject(AuthService)
  public banderaLoader = false;

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(PATRON_EMAIL)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
  });

  showPassword = false;
  toggleClass = "off-line";
  toggleVisibility() {
    this.showPassword = !this.showPassword;
    this.toggleClass === "off-line" ?  "line" :  "off-line";
  }

  isValidField( field: string ): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  getFieldError( field: string ): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  onSubmit(): void {
    
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched();
      return;
    }
    this.banderaLoader = true;

    const { email, password } = this.myForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        const { data, message } = response;
        this.banderaLoader = !this.banderaLoader;
        const { token, type: tipoUsuario, verified } = data;
        localStorage.setItem('token', token);
        // localStorage.setItem('refreshToken', token);
        if( verified.length === 0 ) {
          this.router.navigate(['/auth/verify']);
          return;
        }

        let rutaDashboard: string = tipoUsuario === 'user' ? '/dashboard': '/administration';

        this.router.navigate([rutaDashboard]);
      },
      error: (err) => {
        this.banderaLoader = !this.banderaLoader;
        Swal.fire("Credenciales invalidas", "Verifica tu correo y contraseña.", "error");
      }
    });
  }



}
