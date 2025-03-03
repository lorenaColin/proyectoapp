import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FormaPagoInterface,
  MetodoPagoInterface,
  RegimenInterface,
} from '../../../shared/interfaces/shared.interface';
import { UtilsService } from '../../../shared/services/utils.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import {
  LISTADOFORMAPAGO,
  LISTADOMETODOPAGO,
  LISTADORFCSGENERICOS,
} from '../../../shared/utils/sat';
import { PATRON_EMAIL, PATRON_RFC } from '../../../shared/utils/expressions';
import { Observable, Subscription } from 'rxjs';
import { cat_pais } from '../../services/cat_pais.service';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import {
  CustomerListInterface,
  CustomerResponseInterface,
  CustomersInterface,
} from '../../interfaces/customers.interface';

@Component({
  selector: 'app-form-customer',
  templateUrl: './form-customer.component.html',
  styleUrl: './form-customer.component.scss',
})
export class FormCustomerComponent implements OnChanges {
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
  private cat_pais = inject(cat_pais);
  private customerService = inject(CustomerService);
  private authService = inject(AuthService);
  buttonTitle: string = 'Guardar';
  private subscription: Subscription = new Subscription();
  @Input() productoHijo!: CustomersInterface;
  @Output() respuesta = new EventEmitter<CustomerResponseInterface>();
  clientes: CustomersInterface[] = [];
  idCustomer = 0;
  showLoader = false;
  constructor() { }

  myForm: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(254)],
    ],
    rfc: ['', [Validators.required, Validators.pattern(PATRON_RFC)]],
    regime: ['', Validators.required],
    cp: ['', [Validators.minLength(5), Validators.maxLength(5)]],
    num_reg_id_trib: ['', [Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.pattern(PATRON_EMAIL)]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    address: ['', Validators.required],
    payment_method: ['', Validators.required],
    payment_form: [this.listaFormaPago, [Validators.required]],
    residence: ['', Validators.minLength(3)],
    status: [true],
  });

  ngOnInit(): void { }

  ngOnChanges(): void {
    this.idCustomer = this.productoHijo.id || 0;
    this.myForm.patchValue(this.productoHijo);
    this.idCustomer != 0 ? (this.buttonTitle = 'Actualizar') : 'Guardar';
    if (this.productoHijo.payment_method) {
      this.listaFormaPago = this.utilsService.getFormaPago(
        this.productoHijo.payment_method
      );
      this.myForm.patchValue({
        payment_form: this.productoHijo.payment_form,
      });
    }
    this.listadoRegimen = this.utilsService.getRegimenSat(
      this.productoHijo.rfc
    );
    const rfcValue = this.productoHijo.rfc || '';
    this.onInputRFC({ target: { value: rfcValue } } as any);
  }
  onInputRFC(event: Event): void {
    const el = event.target as HTMLInputElement;
    const rfcValue = el.value;
    console.log('RFC ingresado:', rfcValue);

    if (rfcValue === '') {
      this.listadoRegimen = [];
      this.RFCXAXX = false;
      this.RFCXEXX = false;
      return;
    }

    this.listadoRegimen = this.utilsService.getRegimenSat(rfcValue);
    console.log('Regímenes obtenidos:', this.listadoRegimen);

    if (LISTADORFCSGENERICOS.includes(rfcValue)) {
      this.RFCXAXX = rfcValue === 'XAXX010101000';
      this.RFCXEXX = rfcValue === 'XEXX010101000';
      this.getCpCompany();
    } else {
      this.RFCXAXX = this.RFCXEXX = false;
    }
  }
  getCpCompany(): void {
    const company_id = this.authService.getUuid();
    if (!company_id) {
      console.log('No hay una empresa asociada.');
      return;
    }
    this.customerService.getCompanyInfo(company_id).subscribe(
      (response) => {
        if (response && response.data && response.data.cp) {
          this.myForm.patchValue({ cp: response.data.cp });
          console.log('Código Postal cargado:', response.data.cp);
        } else {
          console.log('La compañía no tiene código postal.');
        }
      },
      (error) => {
        console.error('Error al obtener la información de la compañía:', error);
      }
    );
  }
  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }
  closeModal(): void {
    this.formCustomerReset();
  }

  formCustomerReset(): void {
    console.log("resetting");
    this.myForm.reset(
      {
        name: '',
        rfc: '',
        regime: '',
        cp: '',
        num_reg_id_trib: '',
        email: '',
        phone: '',
        address: '',
        payment_method: '',
        payment_form: '',
        residence: '',
        status: true,
      }
    );
    this.buttonTitle = 'Guardar';
    this.idCustomer = 0;
    this.listaFormaPago = [];
    this.listadoRegimen = [];
  }

  onSubmit(): void {
    this.showLoader = true;

    // Verificar si el formulario es válido
    if (this.myForm.invalid) {
      this.showLoader = false;
      this.myForm.markAllAsTouched();
      console.log('Formulario inválido. Por favor corrija los errores.');
      return;
    }

    const formData = this.myForm.value;
    const company_id = this.authService.getUuid();

    if (!company_id) {
      console.log('No se pudo obtener el company_id.');
      this.showLoader = false;
      return;
    }

    const customerData = { ...formData, company_id };
    console.log('Datos a enviar:', customerData);
    const submitCustomer = this.idCustomer
      ? this.customerService.updateCustomer(this.idCustomer, customerData)
      : this.customerService.createCustomer(customerData);
    this.subscription.add(
      submitCustomer.subscribe((response) => {
        this.showLoader = false;
        this.respuesta.emit(response);
        console.log('Respuesta del servidor:', response);
        this.myForm.reset();
        this.closeModal();
      })
    );
  }

  cpSearch(event: Event): void {
    const el = event.target as HTMLInputElement;
    const cpValue = el.value;
    this.utilsService.getCpSat(cpValue);
  }

  searchPais(): void {
    const termino = this.myForm.get('residence')?.value;
    console.log('Buscando:', termino);

    if (termino && termino.length >= 2) {
      this.filteredPais$ = this.cat_pais.searchPais(termino);
      this.filteredPais$.subscribe((Response) => {
        console.log('Respuesta de la API:', Response);
      });
    }
  }
  getFormaPago(event: Event): void {
    const el = event.target as HTMLInputElement;
    const metodoPago = el.value;
    this.listaFormaPago = [];
    this.myForm.patchValue({ payment_form: '' });
    if (metodoPago === '') return;
    this.listaFormaPago = this.utilsService.getFormaPago(metodoPago);
  }
}
