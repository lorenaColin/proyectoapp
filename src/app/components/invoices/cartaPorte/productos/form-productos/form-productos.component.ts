import { Component, inject } from '@angular/core';
import { ValidatorsService } from '../../../../../shared/services/validators.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-productos',
  templateUrl: './form-productos.component.html',
  styleUrl: './form-productos.component.scss'
})
export class FormProductosComponent {
private fb = inject(FormBuilder);
   private validatorsService = inject(ValidatorsService);
 
   myForm: FormGroup = this.fb.group({
    producto: ['', [Validators.required]],
    medida: ['', [Validators.required]],
    
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
      producto: "",
      medida: "",
     
     })
   }
}
