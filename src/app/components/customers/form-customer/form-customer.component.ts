import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormaPagoInterface, MetodoPagoInterface, RegimenInterface } from '../../../shared/interfaces/shared.interface';
import { UtilsService } from '../../../shared/services/utils.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { LISTADOFORMAPAGO, LISTADOMETODOPAGO, LISTADORFCSGENERICOS } from '../../../shared/utils/sat';
import { PATRON_EMAIL, PATRON_RFC } from '../../../shared/utils/expressions';
import { Observable } from 'rxjs';
import { cat_pais } from '../../services/cat_pais.service';

@Component({
  selector: 'app-form-customer',
  templateUrl: './form-customer.component.html',
  styleUrl: './form-customer.component.scss'
})
export class FormCustomerComponent {
    filteredPais$: Observable<any[]> = new Observable();
  
  RFCXAXX: boolean = false;  
  RFCXEXX: boolean = false;  
  private fb = inject(FormBuilder);
  public banderaFisica: boolean = false;
  listadoRegimen: RegimenInterface[] = [];
  private utilsService = inject(UtilsService);
  private validatorsService = inject(ValidatorsService);
  public listaMetodoPago = LISTADOMETODOPAGO;
  public listaFormaPago: FormaPagoInterface[] = [];
 constructor(private cat_pais : cat_pais) { }

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(254)]],
    rfc: ['', [Validators.required, Validators.pattern(PATRON_RFC)]],
    fiscalRegimen: ['', Validators.required],
    postalCode: ['',[ Validators.minLength(5), Validators.maxLength(5)]],
    registroTrib: ['', [Validators.minLength(2)]],
    email: ['', [Validators.required,Validators.pattern(PATRON_EMAIL)]],
    tel: ['', [Validators.required]],
    direccion: ['', Validators.required],
    metPago: ['', Validators.required],
    fomPago: [this.listaFormaPago, [Validators.required]],
    residencia: ['', Validators.minLength(3)],
  });

  ngOnInit(): void {
  }
  onInputRFC(event: Event): void {
    const el = event.target as HTMLInputElement;
    const rfcValue = el.value;
    console.log('RFC ingresado:', rfcValue);

    this.listadoRegimen = this.utilsService.getRegimenSat(rfcValue);
    console.log('Regímenes obtenidos:', this.listadoRegimen);

    if (LISTADORFCSGENERICOS.includes(rfcValue)) {
      this.RFCXAXX = rfcValue === 'XAXX010101000';
      this.RFCXEXX = rfcValue === 'XEXX010101000';
    } else {
      this.RFCXAXX = this.RFCXEXX = false;
    }
  }


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
  
  cpSearch(event: Event): void {
    const el = event.target as HTMLInputElement;
    const cpValue = el.value;
    this.utilsService.getCpSat( cpValue );
  }
  
  searchPais(): void {
    const termino = this.myForm.get('Residencia')?.value;
    console.log('Buscando:', termino);
  
    if (termino && termino.length >= 2) {
      this.filteredPais$ = this.cat_pais.searchPais(termino);
      this.filteredPais$.subscribe(Response => {
        console.log('Respuesta de la API:', Response);
      });
    }
  }
  getFormaPago(event: Event):void{
    const el = event.target as HTMLInputElement;
    const metodoPago = el.value;
    this.listaFormaPago = [];
    this.myForm.patchValue({ FomPago: '' });
    if(metodoPago === "") return;
    this.listaFormaPago = this.utilsService.getFormaPago(metodoPago)
  }
}
