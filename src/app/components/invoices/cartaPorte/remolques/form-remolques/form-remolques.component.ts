import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/services/validators.service';

@Component({
  selector: 'app-form-remolques',
  templateUrl: './form-remolques.component.html',
  styleUrl: './form-remolques.component.scss'
})
export class FormRemolquesComponent {
 private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);

  myForm: FormGroup = this.fb.group({
    tipoRemolque: ['', [Validators.required]],
    tipoTrasporte: ['', [Validators.required]],
    placavehicular: ['', [Validators.required]],
  });
  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }
  closeModal(): void {
    this.resetProduct();
    // this.idProducto = '0';
    // this.buttonTitle = 'Crear';
  }
  onSubmit(): void {
   
  }
  resetProduct(): void {
    this.myForm.reset({
      cVehicular: "",
      año: "",
      pVehicular: "",
      peso: "",
     
    })
  }
}
