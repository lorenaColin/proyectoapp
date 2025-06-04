import { Component, HostListener, inject } from '@angular/core';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartaPorteService } from '../../services/carta-porte.service';
import { debounceTime, Subject } from 'rxjs';
import { ApiResponseMercnaica, MercanciaInterface } from '../../interfaces/mercancias.interface';
import { MercanciasService } from '../../services/mercancias.service';

@Component({
  selector: 'app-form-invoice-mercancia',
  templateUrl: './form-invoice-mercancia.component.html',
  styleUrl: './form-invoice-mercancia.component.scss'
})
export class FormInvoiceMercanciaComponent {
  private validatorsService = inject(ValidatorsService);
  // private fb = inject(FormBuilder);
  //   private cartaPorteService = inject(CartaPorteService);
  // mercancias = this.cartaPorteService.getUbicacionesFormArray();

  form: FormGroup;
  mercancias: FormArray;

  constructor(
    private fb: FormBuilder,
    private cartaPorteService: CartaPorteService
  ) {
    // formulario interno para capturar la nueva mercancía
    this.form = this.fb.group({
      BienesTransp: ['', Validators.required],
      Cantidad: ['', Validators.required],
      descripcion: ['', ],
      pesoKg: ['', Validators.required],
      ClaveUnidad: ['',],
      dimensiones: ['',],
      distancia: [''],
      ValorMercancia: [''],
      Moneda: ['']
      
    });

    // tomo el FormArray directamente del servicio
    this.mercancias = this.cartaPorteService.getMercanciasFormArray();
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    const nuevaMercancia = this.fb.group(this.form.value);
    this.mercancias.push(nuevaMercancia);
  
    // Accede al formCartaPorte global
    const formCartaPorte = this.mercancias.parent as FormGroup;
  
    if (formCartaPorte) {
      const totalPeso = this.mercancias.controls
        .map(m => +m.get('pesoKg')?.value || 0)
        .reduce((a, b) => a + b, 0);
  
      formCartaPorte.patchValue({
        PesoBrutoTotal: totalPeso,
        UnidadPeso: 'KGM', // Si siempre será fijo
        NumTotalMercancias: this.mercancias.length
      });
    }
  
    this.form.reset();
    const modal = document.querySelector('#hs-extralarge-modal8') as any;
    modal?.hsOverlay?.close();
  }
  

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.form, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.form, field);
  }

  buscar1 = new Subject<string>();
  claveConcepto: string = '';
  showLoader = false;
  private mercanciSer = inject(MercanciasService)
  // listMatPeligroso: catMatPeligroso[] = [];
  filteredMercancia: MercanciaInterface[] = [];
  ngOnInit(): void {

    this.buscar1.pipe(
      debounceTime(500),
    ).subscribe((query: string) => {
      this.Buscar(query);
    });

  }
  onInput(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Buscando :', query);
    this.Buscar(query);  // ✅ aquí sin .next
  }
  
  // private Buscar(query: string): void {
  //   const control = this.form.get('BienesTransp');
  //   if (!control) return;
  //   if (query.length === 0) {
  //     control.setErrors(null);

  //     if (control.hasValidator(Validators.required)) {
  //       control.setValidators([Validators.required]);
  //     }
  //     control.updateValueAndValidity();
  //     this.filteredMercancia = [];
  //     this.showLoader = false;
  //     return;
  //   }
  //   if (query.length < 2) {
  //     control.setErrors({ notFound: true });
  //     this.filteredMercancia = [];
  //     this.showLoader = false;
  //     return;
  //   }
  //   this.showLoader = true;
  //   this.mercanciSer.getAllMercanciaQuery(query).subscribe({
  //     next: (response: ApiResponseMercnaica) => {
  //       console.log('Respuesta de la API:', response);
  //       this.filteredMercancia = response.data || [];
  //       console.log('Productos obtenidos:', this.filteredMercancia);

  //       const exactMatch = this.filteredMercancia.some(producto =>
  //         producto.claveProdServCP.toString().toLowerCase() === query ||
  //         producto.descripcion.toLowerCase() === query
  //       );

  //       if (!exactMatch) {
  //         control.setErrors({ notFound: true });
  //       } else {
  //         control.setErrors(null);
  //       }

  //       this.showLoader = false;
  //     },
  //     error: (err) => {
  //       console.error('Error en la búsqueda de productos:', err);
  //       this.showLoader = false;
  //     }
  //   });
  // }
private getCompanyUuid(): string | null {
  return localStorage.getItem('company');
}

private Buscar(query: string): void {
  const control = this.form.get('BienesTransp');
  if (!control) return;

  if (query.length === 0) {
    control.setErrors(null);
    if (control.hasValidator(Validators.required)) {
      control.setValidators([Validators.required]);
    }
    control.updateValueAndValidity();
    this.filteredMercancia = [];
    this.showLoader = false;
    return;
  }

  if (query.length < 2) {
    control.setErrors({ notFound: true });
    this.filteredMercancia = [];
    this.showLoader = false;
    return;
  }

  this.showLoader = true;

  const ui_company = this.getCompanyUuid();

  this.mercanciSer.getAllMercanciaQuery(query).subscribe({
    next: (response: ApiResponseMercnaica) => {
      console.log('Respuesta de la API:', response);

      const allMercancia = response.data || [];

      // Filtrar por empresa
      this.filteredMercancia = allMercancia.filter(item => {
        const matchEmpresa = item.uuid_company === ui_company;
        const matchTexto =
          item.claveProdServCP?.toLowerCase().includes(query) ||
          item.descripcion?.toLowerCase().includes(query);

        return matchEmpresa && matchTexto;
      });

      console.log('Filtrados:', this.filteredMercancia.length);

      const exactMatch = this.filteredMercancia.some(producto =>
        producto.claveProdServCP.toString().toLowerCase() === query ||
        producto.descripcion.toLowerCase() === query
      );

      if (!exactMatch) {
        control.setErrors({ notFound: true });
      } else {
        control.setErrors(null);
      }

      this.showLoader = false;
    },
    error: (err) => {
      console.error('Error en la búsqueda de productos:', err);
      this.showLoader = false;
    }
  });
}





  matPeligrosoDescription: string = '';


  selectedIndex: number = -1;
  selectMercancia(matPeligroso: MercanciaInterface): void {
    this.matPeligrosoDescription = matPeligroso.descripcion;
    this.form.get('BienesTransp')?.setValue(matPeligroso.claveProdServCP);
    this.filteredMercancia = [];
    this.selectedIndex = -1;
  
    this.form.get('BienesTransp')?.setErrors(null);
  
    // Rellenar los demás campos del formulario
    this.form.patchValue({
      descripcion: matPeligroso.descripcion || '',
      ClaveUnidad: matPeligroso.claveUnidad || '',
      dimensiones: matPeligroso.dimensiones || ''
    });
  
    // Opcional: actualizar visualmente el input del código con la descripción
    const inputElement = document.getElementById('claveInterna') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = matPeligroso.claveProdServCP;
    }
  }
  



  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#BienesTransp')) {
      this.filteredMercancia = [];
    }
  }
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      if (this.selectedIndex < this.filteredMercancia.length - 1) {
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
        this.selectMercancia(this.filteredMercancia[this.selectedIndex]);



      }
    }
  }
}
