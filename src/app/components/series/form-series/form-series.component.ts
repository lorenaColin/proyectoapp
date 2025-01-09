import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validators.service';

@Component({
  selector: 'app-form-series',
  templateUrl: './form-series.component.html',
  styleUrl: './form-series.component.scss'
})

export class FormSeriesComponent {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);

  myForm: FormGroup = this.fb.group({
    serie: ['', [Validators.required, Validators.maxLength(25)]],
    folio:['',[Validators.required, Validators.maxLength(40)]],
    selectedCars2:['',[Validators.required, Validators.maxLength(40)]],
    
    
  });
  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }
  closeModal(): void {
    this.myForm.reset();
  }
  onSubmit(): void {
    if (this.myForm.valid) {
      console.log("Formulario válido, guardando datos...");
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  templates = [
    {
      id: 1,
      name: 'Ingreso',
      value:'p-1'
    },
    {
      id: 2,
      name: 'Egreso',
      value:'p-2'
    },
    {
      id: 3,
      name: 'Traslado',
      value:'p-3'
    },
    {
      id: 4,
      name: 'Pago',
      value:'p-4'
    },
    {
      id: 5,
      name: 'Nomina',
    
      value:'p-5'
    },

  ];
  selectedTemplate = this.templates[1].name;
  simpleItems2: any = [];
  selectedCars2 = ['Andrew'];
  Comprobante = [
    { id: 1, name: 'Ingreso' },
    { id: 2, name: 'Egreso'},
    { id: 3, name: 'Traslado' },
    { id: 4, name: 'Pago' },
    { id: 5, name: 'Nomina' },

  ];
  
}
