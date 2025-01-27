import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/services/validators.service';

@Component({
  selector: 'app-form-autotrasporte',
  templateUrl: './form-autotrasporte.component.html',
  styleUrl: './form-autotrasporte.component.scss'
})
export class FormAutotrasporteComponent {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);

  myForm: FormGroup = this.fb.group({
    cVehicular: ['', [Validators.required]],
    año: ['', [Validators.required]],
    pVehicular: ['', [Validators.required]],
    peso: ['', [Validators.required]],

    


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
