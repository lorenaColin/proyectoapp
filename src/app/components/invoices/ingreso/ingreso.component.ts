import { Component, HostListener, inject, OnInit } from '@angular/core';
import { InvoicesService } from '../../services/invoices.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormaPagoService } from '../../services/forma-pago.service';
import { ConceptsService } from '../../services/concepts.service';
import { TotalsService } from '../../services/totals.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { SeriesService } from '../../services/serie.service';
import { SerietInterface } from '../../interfaces/series.interface';

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


  formaPagoForm = this.formaPagoService.getFormFormaPago();
  totalsForm = this.totalsService.getFormTotals();
  mostrarCP: boolean = false;
  typeProof: string = 'I';
  listSeries: SerietInterface[] = [];
  filteredSeries: SerietInterface[] = []; // Series filtradas por el autocompletado
  selectedIndex: number = -1;   // Índice del elemento seleccionado

  constructor() {}

  formIngreso: FormGroup = this.fb.group({
    invoice_type: ['I', [Validators.required]],
    serie_folio: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    // regimen_emisor: ['', [Validators.required]],
    receptor: ['', [Validators.required]],
    uso_cfdi: ['', [Validators.required]],
    ...this.formaPagoForm.controls,
    ...this.totalsForm.controls,
    concepts: this.conceptsService.getProductosFormArray(),
  });


  onInput(event: any): void {
    const query = event.target.value.toLowerCase();
    if (query.length >= 2) {  // Solo activa el filtro cuando el texto tiene al menos 2 caracteres
      this.filteredSeries = this.listSeries.filter((listSeries) =>
        listSeries.serie.toLowerCase().includes(query) || listSeries.folio.toString().includes(query)
      );
    } else {
      this.filteredSeries = []; // Limpiar resultados si no hay suficiente texto
    }
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
    this.formIngreso.get('serie_folio')?.setValue(`${series.serie} - ${series.folio}`);
    this.filteredSeries = [];  // Limpiar la lista filtrada
    this.selectedIndex = -1;   // Restablecer el índice seleccionado
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#serieFolio')) {
      this.filteredSeries = [];
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
