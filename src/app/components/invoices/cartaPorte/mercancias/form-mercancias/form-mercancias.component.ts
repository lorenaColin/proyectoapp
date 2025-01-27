import { Component, inject, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidatorsService } from "../../../../../shared/services/validators.service";


@Component({
  selector: 'app-form-mercancias',
  templateUrl: './form-mercancias.component.html',
  styleUrl: './form-mercancias.component.scss'
})
export class FormMercanciasComponent {
 private fb = inject(FormBuilder);
   private validatorsService = inject(ValidatorsService);
 
   myForm: FormGroup = this.fb.group({
    mercancias: ['', [Validators.required]],
    unidad: ['', [Validators.required]],
    dimensiones: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
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
      mercancias: "",
      unidad: "",
      dimensiones: "",
      descripcion: "",
      
     })
   }
}
