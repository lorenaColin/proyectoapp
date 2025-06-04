import { Component, HostListener, inject } from '@angular/core';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartaPorteService } from '../../services/carta-porte.service';
import { debounceTime, Subject } from 'rxjs';
import { figurasService } from '../../services/figuras.service';
import { ApiResponseFiguras, FigurasInterface } from '../../interfaces/figuras.interface';

@Component({
  selector: 'app-form-invoice-figuras',
  templateUrl: './form-invoice-figuras.component.html',
  styleUrl: './form-invoice-figuras.component.scss'
})
export class FormInvoiceFigurasComponent {

  private validatorsService = inject(ValidatorsService);
  

  form: FormGroup;
  figuras: FormArray;

  
    constructor(
    private fb: FormBuilder,
    private cartaPorteService: CartaPorteService
  ) {
    this.form = this.fb.group({
      tipoFigura :['',Validators.required ],
      rfcFigura: ['', ],
      numLicencia: ['', ],
      numRegIdTribFigura: ['', ],
      nombreFigura: ['', ],
      residenciaFiscalFigura: ['',],
    });

    this.figuras = this.cartaPorteService.getFigurasFormArray();
  }


  guardar() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const nuevaFigura = this.fb.group(this.form.value);

  // Confirma que 'figuras' esté definido y es un FormArray
  if (this.figuras && this.figuras instanceof FormArray) {
    this.figuras.push(nuevaFigura);
    console.log('Figura agregada correctamente:', nuevaFigura.value);
  } else {
    console.error('FormArray "figuras" no encontrado');
  }

  this.form.reset();

  const modal = document.querySelector('#hs-extralarge-modal9') as any;
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
  private figurasService = inject(figurasService)
  // listMatPeligroso: catMatPeligroso[] = [];
  filteresFiguras: FigurasInterface[] = [];
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
  private getCompanyUuid(): string | null {
  return localStorage.getItem('company');
}

private Buscar(query: string): void {
  const control = this.form.get('rfcFigura');
  if (!control) return;

  if (query.length === 0) {
    control.setErrors(null);
    if (control.hasValidator(Validators.required)) {
      control.setValidators([Validators.required]);
    }
    control.updateValueAndValidity();
    this.filteresFiguras = [];
    this.showLoader = false;
    return;
  }

  if (query.length < 2) {
    control.setErrors({ notFound: true });
    this.filteresFiguras = [];
    this.showLoader = false;
    return;
  }

  this.showLoader = true;

  const companyUuid = this.getCompanyUuid();
  if (!companyUuid) {
    console.warn('No hay UUID de empresa en localStorage');
    control.setErrors({ notFound: true });
    this.filteresFiguras = [];
    this.showLoader = false;
    return;
  }

  this.figurasService.getAllFigurasQuery(query).subscribe({
    next: (response: ApiResponseFiguras) => {
      console.log('Respuesta de la API:', response);

      // Filtramos las figuras que tengan el mismo company_id (o UUID) que companyUuid
      this.filteresFiguras = (response.data || []).filter(figura => figura.uuid_company === companyUuid);

      console.log('Productos filtrados:', this.filteresFiguras);

      const exactMatch = this.filteresFiguras.some(producto =>
        producto.rfcFigura.toLowerCase() === query.toLowerCase() ||
        producto.nombreFigura.toLowerCase() === query.toLowerCase()
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
      control.setErrors({ notFound: true });
      this.showLoader = false;
    }
  });
}

  // private Buscar(query: string): void {
  //   const control = this.form.get('rfcFigura');
  //   if (!control) return;
  //   if (query.length === 0) {
  //     control.setErrors(null);

  //     if (control.hasValidator(Validators.required)) {
  //       control.setValidators([Validators.required]);
  //     }
  //     control.updateValueAndValidity();
  //     this.filteresFiguras = [];
  //     this.showLoader = false;
  //     return;
  //   }
  //   if (query.length < 2) {
  //     control.setErrors({ notFound: true });
  //     this.filteresFiguras = [];
  //     this.showLoader = false;
  //     return;
  //   }
  //   this.showLoader = true;
  //   this.figurasService.getAllFigurasQuery(query).subscribe({
  //     next: (response: ApiResponseFiguras) => {
  //       console.log('Respuesta de la API:', response);
  //       this.filteresFiguras = response.data || [];
  //       console.log('Productos obtenidos:', this.filteresFiguras);

  //       const exactMatch = this.filteresFiguras.some(producto =>
  //         producto.rfcFigura.toString().toLowerCase() === query ||
  //         producto.nombreFigura.toLowerCase() === query
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





  matPeligrosoDescription: string = '';


  selectedIndex: number = -1;
  selectMercancia(matPeligroso: FigurasInterface): void {
    this.matPeligrosoDescription = matPeligroso.nombreFigura;
    this.form.get('rfcFigura')?.setValue(matPeligroso.rfcFigura);
    this.filteresFiguras = [];
    this.selectedIndex = -1;
  
    this.form.get('rfcFigura')?.setErrors(null);
  
    // Rellenar los demás campos del formulario
    this.form.patchValue({
      tipoFigura: matPeligroso.tipoFigura|| '',
      numLicencia: matPeligroso.numLicencia || '',
      numRegIdTribFigura: matPeligroso.numRegIdTribFigura || '',
      nombreFigura: matPeligroso.nombreFigura || '',
      residenciaFiscalFigura: matPeligroso.residenciaFiscalFigura|| '',




    });
  
    // Opcional: actualizar visualmente el input del código con la descripción
    const inputElement = document.getElementById('claveInterna') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = matPeligroso.rfcFigura;
    }
  }
  



  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#rfcFigura')) {
      this.filteresFiguras = [];
    }
  }
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      if (this.selectedIndex < this.filteresFiguras.length - 1) {
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
        this.selectMercancia(this.filteresFiguras[this.selectedIndex]);



      }
    }
  }
}
