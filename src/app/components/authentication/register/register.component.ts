import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PATRON_CONTRASENA, PATRON_EMAIL } from '../../../shared/utils/expressions';
import { ValidatorsService } from '../../../shared/services/validators.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private fb =  inject(FormBuilder);
  private router = inject(Router)
  private validatorsService = inject(ValidatorsService);

  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.maxLength(75), Validators.pattern(PATRON_EMAIL)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern(PATRON_CONTRASENA)]],
    confirmPassword: ['', [Validators.required]],
    termsAndConditions: [ false, Validators.requiredTrue ],
  },{
    validators: [this.validatorsService.isFieldOneEqualFieldTwo('password','confirmPassword')]
  });

  showPassword = false;
  toggleClass = "off-line";
  toggleVisibility() {
    this.showPassword = !this.showPassword;
    this.toggleClass === "off-line" ?  "line" :  "off-line";
  }

  showPassword1 = false;
  toggleClass1 = "off-line";
  toggleVisibility1() {
    this.showPassword1 = !this.showPassword1;
    this.toggleClass1 === "off-line" ?  "line" :  "off-line";
  }

  isValidField(field:string ): boolean | null {
    return this.validatorsService.isValidField( this.myForm, field );
  }

  getFieldError(field:string): string | null {
    return this.validatorsService.getFieldError( this.myForm, field );
  }

  onSubmit(): void{
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched();
      return;
    }
    this.router.navigate(['/auth/verify']);
  }

}
