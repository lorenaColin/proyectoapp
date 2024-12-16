import { LocationStrategy } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {
  


  private validatorsService = inject(ValidatorsService);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public myForm: FormGroup =  this.fb.group({
    code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
  });

  constructor(
    private locationStrategy: LocationStrategy,
  ){
    history.pushState(null, 'null', window.location.href);  
    this.locationStrategy.onPopState(() => {
      history.pushState(null, 'null', window.location.href);
    });  
  }


  sendCode(): void {

    this.userService.getCodeUser().subscribe( response => {
      console.log({response});
    });
  }

  isValidField( field: string ): boolean | null {
    return this.validatorsService.isValidField( this.myForm, field );
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError( this.myForm, field );
  }

  onSubmit(): void {
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched();
      return;
    }

    const { code } = this.myForm.value;
    this.authService.verifyCode( code ).subscribe(response => {
      const { error, message } = response;
      if(error) {
        console.error(message)
        return
      }
      console.log(message)
      this.router.navigate(['/administration']);
    });
  }

}
