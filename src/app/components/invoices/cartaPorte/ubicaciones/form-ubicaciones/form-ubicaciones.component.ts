import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/services/validators.service';
import { PATRON_RFC } from '../../../../../shared/utils/expressions';

@Component({
  selector: 'app-form-ubicaciones',
  templateUrl: './form-ubicaciones.component.html',
  styleUrl: './form-ubicaciones.component.scss'
})
export class FormUbicacionesComponent {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);

  myForm: FormGroup = this.fb.group({
    rfc: ['', [Validators.required, Validators.pattern(PATRON_RFC)]],
    idUbicacion: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    numRegTrib: ['', [Validators.required]],
    residenciaFiscal: ['', [Validators.required]],
    tipo: ['', [Validators.required]],

    


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
      rfc: "",
      idUbicacion: "",
      nombre: "",
      numRegTrib: "",
      residenciaFiscal: "",
      domicilio: "",
      getFieldError: "",
    })
  }
}
