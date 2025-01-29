import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/services/validators.service';

@Component({
  selector: 'app-form-figuras',
  templateUrl: './form-figuras.component.html',
  styleUrl: './form-figuras.component.scss'
})
export class FormFigurasComponent {
private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);

  myForm: FormGroup = this.fb.group({
    tipo: ['', [Validators.required]],
    rfc: ['', [Validators.required]],
    licencia: ['', [Validators.required, Validators.minLength(6),  Validators.maxLength(16),]],
    nombre: ['', [ Validators.minLength(1), Validators.maxLength(255),]],
    numRegTrib: ['', [Validators.minLength(6),  Validators.maxLength(40)]],
    rFiscal: ['', [Validators.required]],
    // domicilio: ['', [Validators.required]],

    

    


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
      tipo: "",
      rfc: "",
      licencia: "",
      nombre: "",
      numRegTrib: "",
      rFiscal: "",
      domicilio: "",
    })
  }
}
