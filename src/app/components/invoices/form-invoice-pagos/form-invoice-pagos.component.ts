import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { LISTABANCO, LISTADOFORMAPAGO, LISTAMONEDADEPAGO } from '../../../shared/utils/sat';

@Component({
  selector: 'app-form-invoice-pagos',
  templateUrl: './form-invoice-pagos.component.html',
  styleUrl: './form-invoice-pagos.component.scss'
})
export class FormInvoicePagosComponent {
  private fb = inject(FormBuilder);
    private validatorsService = inject(ValidatorsService);
  listadoFormaPago = LISTADOFORMAPAGO;
  listaMonedaPago = LISTAMONEDADEPAGO;
  listabanco=LISTABANCO
  monedaPagoSeleccionada: string = 'AME'; 
  moneda: boolean = false;
  constructor() {
    this.onMonedaPagoChange();
  }


   myForm: FormGroup = this.fb.group({
    buscador: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    folio: ['', [ Validators.minLength(3), Validators.maxLength(10)]],
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    uuid: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    parcialidad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    factura: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    fechaPago: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    formaPago: ['', [Validators.required,  Validators.maxLength(254)]],
    MonedaPago: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    cambio: [{ value: 1, disabled: true }, [Validators.required, Validators.min(0)]],
    monto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    salgoInsoluto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    numOperacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    rfcReceptor: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    razonSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    banco: ['', [Validators.required, Validators.maxLength(254)]],



    });
  
  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField( this.myForm, field );
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
  onMonedaPagoChange(): void {
    this.myForm.get('MonedaPago')?.valueChanges.subscribe((value) => {
      if (value === 'DAM') { // Dólar Americano
        this.myForm.get('cambio')?.enable();
        this.myForm.get('cambio')?.setValue(null); // Limpia el valor
      } else if (value === 'AME') { // Peso Mexicano
        this.myForm.get('cambio')?.disable();
        this.myForm.get('cambio')?.setValue(1); // Establece el valor predeterminado
      }
    });
  }
 
}
