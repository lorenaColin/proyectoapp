import { Component, HostListener, inject } from '@angular/core';
import { TotalsService } from '../../services/totals.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConceptsService } from '../../services/concepts.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { SeriesService } from '../../services/serie.service';
import { SerietInterface } from '../../interfaces/series.interface';
import { CustomersInterface } from '../../interfaces/customers.interface';
import { CustomerService } from '../../services/customer.service';
import { LISTADOFORMAPAGO, LISTADOMETODOPAGO, LISTADOUSOCFDI } from '../../../shared/utils/sat';
import { FormaPagoInterface, MetodoPagoInterface } from '../../../shared/interfaces/shared.interface';
import { UtilsService } from '../../../shared/services/utils.service';
import { AuthService } from '../../services/auth.service';
import { InvoicesService } from '../../services/invoices.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RelatedsService } from '../../services/relateds.service';
import { CartaPorteService } from '../../services/carta-porte.service';

@Component({
  selector: 'app-traslado',
  templateUrl: './traslado.component.html',
  styleUrls: ['./traslado.component.scss']
})
export class TrasladoComponent {
  private fb = inject(FormBuilder);
  mostrarCP: boolean = false;
  private totalsService = inject(TotalsService);
  totalsForm = this.totalsService.getFormTotals();
  private conceptsService = inject(ConceptsService);
  typeProof: string = 'T';
  private seriesService = inject(SeriesService);
  private validatorsService = inject(ValidatorsService);
  filteredSeries: SerietInterface[] = [];
  filteredReceptors: CustomersInterface[] = [];
  listReceptors: CustomersInterface[] = [];
  listaCfdi = LISTADOUSOCFDI;
  listadoFormaPago: FormaPagoInterface[] = [];
  listadoMetodoPago: MetodoPagoInterface[] = LISTADOMETODOPAGO;
    private utilsService = inject(UtilsService);
    private authService = inject(AuthService);
  listadoFechas = this.utilsService.getDates();
  private invoicesService = inject(InvoicesService);
    private relatedsService = inject(RelatedsService);
  
  relacionForm = this.relatedsService.getFormRelateds();
  private cartaPorteService = inject(CartaPorteService);
  formCartaPorte: FormGroup = this.cartaPorteService.getFormCarta();
  selectedIndex: number = -1;
  private customerService = inject(CustomerService);

  // constructor() {
  //   // this.formTraslado.patchValue({
  //   //   subtotal: 6.200, 
  //   //   total: 10.500,   
  //   // });
  // }
  constructor(  private router: Router) {
    this.totalsService.setForm(this.formTraslado);
    this.conceptsService.setForm(this.formTraslado);
    
  }
  cancelar() {
    this.router.navigate(['/dashboard']);
  }
  formTraslado: FormGroup = this.fb.group({
    invoice_type: 'T',
    serie_folio: '',
    fecha: '',
     ...this.totalsForm.controls,
        relaciones: this.relacionForm.get('relaciones') as FormArray,
        concepts: [this.fb.array([])],
        complemento_carta_porte: this.formCartaPorte
    // regimen_emisor: '',
    // receptor: '',
    // uso_cfdi: '',
    // currency: 'XXX',
    // exportacion: '01', ??
    // lugar_expedicion: '42501', ??
    // ...this.totalsForm.controls,
    // subtotal: this.totalsService.getFormTotals().get('subtotal')?.value(6.200),
    // concepts: this.conceptsService.getProductosFormArray(),
  });
  showLoader = false;

onSubmitTraslado() {
  console.log('Form valid:', this.formTraslado.valid);
  console.log('Value:', this.formTraslado.value);

  // Nuevo: listamos los controles inválidos
  const invalidControls = Object.keys(this.formTraslado.controls)
    .filter(key => this.formTraslado.get(key)?.invalid);
  console.log('Invalid controls:', invalidControls);
  
  if (this.formTraslado.invalid) {
    this.formTraslado.markAllAsTouched();
    return;
  }

  // Activamos el loader antes de la llamada al servicio
  this.showLoader = true;

  const uuidCompany = this.authService.getUuid();
  
  const formulario = {
    ...this.formTraslado.value,
    uuid_company: uuidCompany || '',
  };
  
  this.invoicesService.createInvoice(formulario).subscribe(
    (respuesta: any) => {
      console.log(respuesta);

      const rutaXml = respuesta?.xml_path;
      if (rutaXml) {
        localStorage.setItem('ultimoXmlGenerado', rutaXml);
      }

      // Desactivamos el loader al recibir la respuesta
      this.showLoader = false;

      Swal.fire({
        title: '¡Comprobante creado!',
        text: 'El comprobante se ha generado correctamente.',
        icon: 'success',
        confirmButtonText: 'Ver comprobantes'
      }).then(() => {
        this.router.navigate(['/emitidos/cp']);
      });
    },
    (error) => {
      console.error('Error al crear comprobante:', error);

      // Desactivamos el loader en caso de error
      this.showLoader = false;

      Swal.fire({
        title: '¡Comprobante creado!',
        text: 'El comprobante se ha generado correctamente (aunque no fue timbrado).',
        icon: 'success',
        confirmButtonText: 'Ver comprobantes'
      }).then(() => {
        this.router.navigate(['/emitidos/cp']);
      });
    }
  );
}



 
  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.formTraslado, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.formTraslado, field);
  }
  listSeries: SerietInterface[] = [];
  ngOnInit(): void {
    this.loadSerie();
  }
  
  loadSerie(): void {

    this.seriesService.getAllSeries().subscribe((response) => {
      const { error, data } = response;
      (!error) ? this.listSeries = data : '';
    });
  }


  onInputReceptorJun(event: any, listType: 'series' | 'receptors'): void {
    const query = (event.target.value || '').trim().toLowerCase();

    const control = this.formTraslado.get(listType === 'series' ? 'serie_folio' : 'receptor');
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
    this.formTraslado.get('serie_folio')?.setValue(`${series.serie} - ${series.folio}`);
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

    this.formTraslado.get('receptor')?.setValue(`${receptor.name}`);

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
      const inputControl = this.formTraslado.get('receptor');
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

  searchFormaPago() {
    const { metodo_pago: metodoPago } = this.formTraslado.value;
    this.listadoFormaPago = [];
    if (metodoPago === "") return;
    this.listadoFormaPago = LISTADOFORMAPAGO.filter(forma => forma.metodoPago === metodoPago);
  }




  checkAndClearInput(fieldName: string, list: any[], compareFn: (item: any) => string): void {
    const inputValue = this.formTraslado.get(fieldName)?.value;
    const isValid = list.some(item => compareFn(item) === inputValue);

    if (!isValid) {
      this.formTraslado.get(fieldName)?.setValue('');  // Limpiar el campo si no está en la lista
    }
  }
}
