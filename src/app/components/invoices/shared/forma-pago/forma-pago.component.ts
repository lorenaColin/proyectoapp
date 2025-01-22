import { Component, inject } from '@angular/core';
import { FormaPagoInterface, MetodoPagoInterface } from '../../../../shared/interfaces/shared.interface';
import { LISTADOFORMAPAGO, LISTADOMETODOPAGO } from '../../../../shared/utils/sat';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormaPagoService } from '../../../services/forma-pago.service';
import { ValidatorsService } from '../../../../shared/services/validators.service';

@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html',
  styleUrl: './forma-pago.component.scss'
})
export class FormaPagoComponent {
  public listadoMetodoPago: MetodoPagoInterface[]= LISTADOMETODOPAGO;
  public listadoFormaPago: FormaPagoInterface[] = [];
  private formaPagoService = inject(FormaPagoService);  
  private validatorsService = inject(ValidatorsService);  
  formaPagoForm = this.formaPagoService.getFormFormaPago(); 
  
    searchFormaPago(): void {
      console.log("dd");
      const{  metodoPago } = this.formaPagoForm.value;
      console.log(metodoPago);
      this.listadoFormaPago = [];
      if(metodoPago === "") return;
      this.listadoFormaPago = LISTADOFORMAPAGO.filter(forma => forma.metodoPago === metodoPago);
    }
  
    getFieldError(field: string): string | null {
      return this.validatorsService.getFieldError(this.formaPagoForm, field);
    }
    
    isValidField(field: string): boolean | null {
      return this.validatorsService.isValidField( this.formaPagoForm, field );
    }
    
}
