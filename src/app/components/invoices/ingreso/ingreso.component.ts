import { Component, HostListener, inject, OnInit } from '@angular/core';
import { InvoicesService } from '../../services/invoices.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormaPagoService } from '../../services/forma-pago.service';
import { ConceptsService } from '../../services/concepts.service';
import { TotalsService } from '../../services/totals.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { SeriesService } from '../../services/serie.service';
import { SerietInterface } from '../../interfaces/series.interface';
import { CustomersInterface } from '../../interfaces/customers.interface';
import { CustomerService } from '../../services/customer.service';

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


  formaPagoForm = this.formaPagoService.getFormFormaPago();
  totalsForm = this.totalsService.getFormTotals();
  mostrarCP: boolean = false;
  typeProof: string = 'I';
  listSeries: SerietInterface[] = [];
  filteredSeries: SerietInterface[] = []; 
  
  listReceptors: CustomersInterface[] = [];
  filteredReceptors: CustomersInterface[] = []; 
  selectedIndex: number = -1;   

  constructor() {}

  formIngreso: FormGroup = this.fb.group({
    invoice_type: ['I', [Validators.required]],
    serie_folio: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    
    receptor: ['', [Validators.required]],
    uso_cfdi: ['', [Validators.required]],
    ...this.formaPagoForm.controls,
    ...this.totalsForm.controls,
    concepts: this.conceptsService.getProductosFormArray(),
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

  onInputReceptor(event: any, listType: 'series' | 'receptors'): void {
    const query = event.target.value.toLowerCase();
    if (query.length >= 2) {
      if (listType === 'series') {
        this.filteredSeries = this.listSeries.filter(item =>
          item.serie.toLowerCase().includes(query) || item.folio.toString().includes(query)
        );
      } else if (listType === 'receptors') {
        this.filteredReceptors = this.listReceptors.filter(item =>
          item.name.toLowerCase().includes(query)
        );
      }
    } else {
      if (listType === 'series') {
        this.filteredSeries = [];
      } else if (listType === 'receptors') {
        this.filteredReceptors = [];
      }
    }
  }

  // onInput(event: any, list: any[], filterKey: string, filteredList: any[]): void {
  //   console.log(event);
  //   console.log(list);
  //   console.log(filterKey);
  //   console.log(filteredList);
  //   const query = event.target.value.toLowerCase();
  //   console.log(query);
  //   if (query.length >= 2) {  
  //     filteredList = list.filter((item) =>
  //       item.filterKey.toLowerCase().includes(query)
  //     );
  //   } else {
  //     filteredList = []; 
  //   }
  // }
  
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

  onKeyDownReceptor(event: KeyboardEvent): void {
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

  selectSerie(series: any): void {
    this.formIngreso.get('serie_folio')?.setValue(`${series.serie} - ${series.folio}`);
    this.filteredSeries = [];  
    this.selectedIndex = -1;   
  }

  selectReceptor(receptor: any): void {
    this.formIngreso.get('receptor')?.setValue(`${receptor.name}`);
    this.filteredReceptors = [];  
    this.selectedIndex = -1;   
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#serieFolio')) {
      this.filteredSeries = [];
    } else if (!targetElement.closest('#receptor')) {
      this.filteredReceptors = [];
      
    }
  }
  agregarCartaP(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked; 
    this.mostrarCP = isChecked; 
    console.log('Checkbox is:', isChecked ? 'Checked' : 'Unchecked');
  }

  ngOnInit(): void {
    this.seriesService.getAllSeries().subscribe((response) => {
      const { error, data } = response;
      console.log('Datos recibidos:', data);
      (!error) ? this.listSeries = data : '';
    });
    this.customerService.getCustomers().subscribe((response) => {
      const { error, data } = response;
      console.log('Datos recibidos:', data);
      (!error) ? this.listReceptors = data : '';
    });
  }

  onSubmitIngreso() {
    console.log('Ingreso');
    if (this.formIngreso.invalid) {
      this.formIngreso.markAllAsTouched();    
      return;
    }
    console.log(this.formIngreso.value);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.formIngreso, field);
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField( this.formIngreso, field );
  }
  
}
