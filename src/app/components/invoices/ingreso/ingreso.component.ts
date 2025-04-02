import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormaPagoService } from '../../services/forma-pago.service';
import { ConceptsService } from '../../services/concepts.service';
import { TotalsService } from '../../services/totals.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { SeriesService } from '../../services/serie.service';
import { SerietInterface } from '../../interfaces/series.interface';
import { CustomersInterface } from '../../interfaces/customers.interface';
import { CustomerService } from '../../services/customer.service';
import { RelatedsService } from '../../services/relateds.service';
import { LISTADOFORMAPAGO, LISTADOMETODOPAGO, LISTADOUSOCFDI } from '../../../shared/utils/sat';
import { UtilsService } from '../../../shared/services/utils.service';
import { FormaPagoInterface, MetodoPagoInterface } from '../../../shared/interfaces/shared.interface';
import { InvoicesService } from '../../services/invoices.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrl: './ingreso.component.scss'
})
export class IngresoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private formaPagoService = inject(FormaPagoService);
  private totalsService = inject(TotalsService);
  private conceptsService = inject(ConceptsService);
  private validatorsService = inject(ValidatorsService);
  private seriesService = inject(SeriesService);
  private customerService = inject(CustomerService);
  private relatedsService = inject(RelatedsService);
  private utilsService = inject(UtilsService);
  private invoicesService = inject(InvoicesService);
  private authService = inject(AuthService);

  listadoFechas = this.utilsService.getDates();
  listadoMetodoPago: MetodoPagoInterface[]= LISTADOMETODOPAGO;
  listadoFormaPago: FormaPagoInterface[] = [];
  listaCfdi = LISTADOUSOCFDI;
  formaPagoForm = this.formaPagoService.getFormFormaPago();
  relacionForm = this.relatedsService.getFormRelateds();
  totalsForm = this.totalsService.getFormTotals();
  mostrarCP: boolean = false;
  typeProof: string = 'I';
  listSeries: SerietInterface[] = [];
  filteredSeries: SerietInterface[] = [];

  listReceptors: CustomersInterface[] = [];
  filteredReceptors: CustomersInterface[] = [];
  selectedIndex: number = -1;

  constructor() {
    this.totalsService.setForm(this.formIngreso);
    this.conceptsService.setForm(this.formIngreso);
  }


  formIngreso: FormGroup = this.fb.group({
    invoice_type: ['I'],
    serie_folio: [''],
    fecha: ['', [Validators.required]],
    receptor: ['1', [Validators.required]],
    uso_cfdi: ['1', [Validators.required]],
    metodo_pago: ['1', [Validators.required]],
    forma_pago: ['1', [Validators.required]],
    moneda: ['1', [Validators.required]],
    condiciones: ['1', [Validators.required]],
    tipo_cambio: ['1', [Validators.required]],
    ...this.totalsForm.controls,
    relaciones: this.relacionForm.get('relaciones') as FormArray,
    concepts: [this.fb.array([])],
    // totals: this.totalsService.getFormTotals().controls,
  });

  // private filterMap = {
  //   series: (item: any, query: string) => item.serie.toLowerCase().includes(query) || item.folio.toString().includes(query),
  //   receptors: (item: any, query: string) => item.name.toLowerCase().includes(query),
  //   categorias: (item: any, query: string) => item.categoria.toLowerCase().includes(query)
  // };

  // onInput(event: any, listType: keyof typeof this.filterMap): void {
  //   const query = event.target.value.toLowerCase();
  //   if (query.length >= 2) {  
  //     this.filteredSeries = this.listSeries.filter((listSeries) =>
  //       listSeries.serie.toLowerCase().includes(query) || listSeries.folio.toString().includes(query)
  //     );
  //   } else {
  //     this.filteredSeries = []; 
  //   }
  // }
  ngOnInit(): void {
    console.log(this.listaCfdi);
    this.loadSerie();
    this.loadReceptor();
    
  }

  onSubmitIngreso() {
    console.log('Ingreso');
    console.log(this.formIngreso.value);
    if (this.formIngreso.invalid) {
      this.formIngreso.markAllAsTouched();
      return;
    }
    // let { concepts } = this.formIngreso.value;
    // if(concepts.length === 0){
    //   console.log("debes agregar un concepto")
    //   return
    // }
    const uuidCompany = this.authService.getUuid();
    let formulario = {
      ...this.formIngreso.value,
      uuid_company: uuidCompany || '',
    }
    this.invoicesService.createInvoice(formulario).subscribe(
      (respuesta) => {
        console.log(respuesta);
      }
    )
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.formIngreso, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.formIngreso, field);
  }


  loadSerie(): void {

    this.seriesService.getAllSeries().subscribe((response) => {
      const { error, data } = response;
      console.log('Datos recibidos:', data);
      (!error) ? this.listSeries = data : '';
    });
  }

  showLoader = false;

  onInputReceptorJun(event: any, listType: 'series' | 'receptors'): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Texto ingresado:', query);
  
    const control = this.formIngreso.get(listType === 'series' ? 'serie_folio' : 'receptor');
    if (!control) return;
  
    if (query.length === 0) {
      control.setErrors({ notFound: true });
  
      if (control.hasValidator(Validators.required)) {
        control.setValidators([Validators.required]);
      }
      control.updateValueAndValidity();
  
      if (listType === 'series') {
        this.filteredSeries = [];
      } else {
        this.filteredReceptors = [];
      }
  
      this.showLoader = false;
      return;
    }
  
    if (query.length < 2) {
      if (listType === 'series') {
        this.filteredSeries = [];
      } else {
        this.filteredReceptors = [];
      }
  
      this.showLoader = false;
      control.setErrors({ notFound: true });
      return;
    }
  
    this.showLoader = true;
  
    setTimeout(() => {
      if (listType === 'series') {
        this.filteredSeries = this.listSeries.filter(item =>
          item.serie.toLowerCase().includes(query) || item.folio.toString().includes(query)
        );
  
        control.setErrors(this.filteredSeries.length === 0 ? { notFound: true } : null);
      } else {
        this.filteredReceptors = this.listReceptors.filter(item =>
          item.name.toLowerCase().includes(query) || item.id.toString().includes(query)
        );
  
        control.setErrors(this.filteredReceptors.length === 0 ? { notFound: true } : null);
      }
  
      this.showLoader = false;
    }, 500);
  }
  
 


  
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      if (this.selectedIndex < this.filteredSeries.length - 1) {
        this.selectedIndex++;
      }
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      event.preventDefault();
    } else if (event.key === 'Enter') {
      if (this.selectedIndex >= 0) {
        this.selectSerie(this.filteredSeries[this.selectedIndex]);



      }
    }
  }


  selectSerie(series: any): void {
    console.log(series);
    this.formIngreso.get('serie_folio')?.setValue(`${series.serie} - ${series.folio}`);
    this.filteredSeries = [];
    this.selectedIndex = -1;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside1(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#serie_folio')) {
      this.filteredSeries = [];
    }
  }



  loadReceptor(): void {
    this.customerService.getCustomers().subscribe((response) => {
      const { error, data } = response;
      console.log('Datos recibidos:', data);
      (!error) ? this.listReceptors = data : '';
    });
  }
 
  onKeyDown2(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      if (this.selectedIndex < this.filteredReceptors.length - 1) {
        this.selectedIndex++;
      }
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      event.preventDefault();
    } else if (event.key === 'Enter') {
      if (this.selectedIndex >= 0) {
        this.selectSerie(this.filteredReceptors[this.selectedIndex]);



      }
    }
  }
  selectReceptor(receptor: any): void {
    console.log(receptor);
    console.log(receptor.regime);
  
    this.formIngreso.get('receptor')?.setValue(`${receptor.name}`);
  
    this.filteredReceptors = [];
    this.selectedIndex = -1;   
  
    this.listaCfdi = LISTADOUSOCFDI.filter(cfdi => 
      cfdi.regimen.some(r => receptor.regime.includes(r))
    );
  }
  @HostListener('document:click', ['$event'])
  onClickOutside2(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
  
    if (!targetElement.closest('#receptor')) {
      const inputControl = this.formIngreso.get('receptor');
      const inputValue = inputControl?.value?.trim().toLowerCase();
  
      if (inputValue) {
        const exists = this.listReceptors.some(item => item.name.toLowerCase() === inputValue);
  
        if (!exists) {
          inputControl?.setErrors({ notFound: true });
        } else {
          inputControl?.setErrors(null);
        }
      }
    }
  }

  searchFormaPago(){
    const { metodo_pago:metodoPago } = this.formIngreso.value;
    this.listadoFormaPago = [];
    if(metodoPago === "") return;
    this.listadoFormaPago = LISTADOFORMAPAGO.filter(forma => forma.metodoPago === metodoPago);
  }
  

 

  checkAndClearInput(fieldName: string, list: any[], compareFn: (item: any) => string): void {
    const inputValue = this.formIngreso.get(fieldName)?.value;
    const isValid = list.some(item => compareFn(item) === inputValue);

    if (!isValid) {
      this.formIngreso.get(fieldName)?.setValue('');  // Limpiar el campo si no está en la lista
    }
  }

  agregarCartaP(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.mostrarCP = isChecked;
    console.log('Checkbox is:', isChecked ? 'Checked' : 'Unchecked');
  }



}
