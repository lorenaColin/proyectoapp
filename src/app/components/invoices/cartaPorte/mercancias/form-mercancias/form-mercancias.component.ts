import { Component, EventEmitter, HostListener, inject, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidatorsService } from "../../../../../shared/services/validators.service";
import { ApiResponse, ApiResponseClave, ApiResponseEmbalaje, ApiResponseMatPeligroso, catClaveUnidad, catEmbalaje, catMatPeligroso, CatProdServCP, MercanciaInterface, MercanciaListResponseInterface } from "../../../../interfaces/mercancias.interface";
import { AuthService } from "../../../../services/auth.service";
import { MercanciasService } from "../../../../services/mercancias.service";
import { DIMENSIONES_REGEX } from "../../../../../shared/utils/expressions";
import { debounceTime, Subject } from "rxjs";


@Component({
  selector: 'app-form-mercancias',
  templateUrl: './form-mercancias.component.html',
  styleUrl: './form-mercancias.component.scss'
})
export class FormMercanciasComponent {
  @Input() mercanciaHijo!: MercanciaInterface;
  @Output() respuesta = new EventEmitter<MercanciaInterface>();

  mercancias: string[] = [];
  showLoader = false;
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private authService = inject(AuthService);
  private mercanciSer = inject(MercanciasService)
  buttonTitle: string = 'Crear';
  idMercancia = 0;
  isDomicilioChecked = false;
  bandera: boolean = false;
  showTooltip = false;
  showTooltip1 = false;
  ngOnChanges(): void {
    if (this.mercanciaHijo) {
      this.idMercancia = this.mercanciaHijo.id || 0;
      this.buttonTitle = this.idMercancia !== 0 ? 'Actualizar' : 'Crear';
      this.myForm.patchValue({
        ...this.mercanciaHijo,
      });
    } else {
      this.myForm.reset();
    }

  }
  get currentUbicacion(): MercanciaInterface {
    const mercancia = this.myForm.value as MercanciaInterface;
    console.log(mercancia)
    return mercancia;
  }
  myForm: FormGroup = this.fb.group({
    claveProdServCP: ['', [Validators.required]],
    claveUnidad: ['', [Validators.required]],
    unidad: ['', [Validators.required]],
    dimensiones: ['', [Validators.pattern(DIMENSIONES_REGEX)]],
    descripcion: ['', [Validators.required]],
    materialPeligroso: ['', []],
    cveMaterialPeligroso: ['', []],
    embalaje: ['', []],
    descripEmbalaje: ['', []],
  });
  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }
  closeModal(): void {
    this.resetMercancia();
    this.idMercancia = 0;
    this.buttonTitle = 'Crear';

  }
  onSubmit(): void {
    console.log('enhtrando a onsubmit ');
    if (this.myForm.valid) {
      this.showLoader = true;
      const uuidCompany = this.authService.getUuid();
      console.log('UUID de la empresa:', uuidCompany);

      const formData = {
        ...this.myForm.value,
        uuid_company: uuidCompany || '',
      };
      console.log('Datos que se envían:', formData);
      const action = this.idMercancia !== 0
        ? this.mercanciSer.updatemercancias(this.idMercancia, formData)
        : this.mercanciSer.createmercancias(formData);

      action.subscribe({
        next: (response) => {
          this.respuesta.emit(response.data);
          // this.resetMercancia();
          this.showLoader = false;
        },
        error: (err) => {
          console.error('Error al enviar los datos:', err);
          this.showLoader = false;
        },
      });
    } else {
      this.myForm.markAllAsTouched();
      Object.keys(this.myForm.controls).forEach((controlName) => {
        const control = this.myForm.get(controlName);
        if (control?.invalid && control?.touched) {
          console.log(`Campo inválido: ${controlName}`, control.errors);
        }
      });
    }
  }
  resetMercancia(): void {
    this.myForm.reset({
      mercancias: "",
      unidad: "",
      dimensiones: "",
      descripcion: "",
      materialPeligroso: "",
      cveMaterialPeligroso: "",
      embalaje: "",
      descripEmbalaje: "",

    })
  }

  listMercancia: CatProdServCP[] = [];
  filteredMercancia: CatProdServCP[] = [];
  selectedIndex: number = -1;
  buscar1 = new Subject<string>();
  buscar2 = new Subject<string>();
  buscar3 = new Subject<string>();
  buscar4 = new Subject<string>();

  

  ngOnInit(): void {
    this.buscar1.pipe(
      debounceTime(500),
    ).subscribe((query: string) => {
      this.BuscarMercancia(query);
    });
    this.buscar2.pipe(
      debounceTime(500),
    ).subscribe((query: string) => {
      this.BuscarClave(query);
    });
    this.buscar3.pipe(
      debounceTime(500),
    ).subscribe((query: string) => {
      this.BuscarMatPeligroso(query);
    });
    this.buscar4.pipe(
      debounceTime(500),
    ).subscribe((query: string) => {
      this.BuscarEmbalaje(query);
    });
    
  }

  onInput(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Buscando pais:', query);
    this.buscar1.next(query);
  }
  private BuscarMercancia(query: string): void {
      const control = this.myForm.get('claveProdServCP');
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
      this.mercanciSer.getAllProductsAndServices(query).subscribe({
        next: (response: ApiResponse) => {
          console.log('Respuesta de la API:', response);
          this.filteredMercancia = response.data || [];
          console.log('Productos obtenidos:', this.filteredMercancia);
  
          const exactMatch = this.filteredMercancia.some(producto =>
            producto.c_ClaveProdServ.toString().toLowerCase() === query ||
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
  claveProdServDescription: string = '';
  selectMercancia(Mercancia: CatProdServCP): void {
    console.log(Mercancia);
    let { c_ClaveProdServ, descripcion, material_peligroso } = Mercancia;

    this.myForm.get('claveProdServCP')?.setValue(c_ClaveProdServ);
    this.claveProdServDescription = descripcion;
    this.myForm.get('claveProdServCP')?.setErrors(null);
    const inputElement = document.getElementById('descripcionProducto') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = this.claveProdServDescription;
    }

    if (material_peligroso === "1") {

      this.bandera = true;

    } else if (material_peligroso === "0,1") {
      this.bandera = true;
    } else if (material_peligroso === "0") {
      this.bandera = false;
    }

    if (material_peligroso === "1") {
      this.myForm.get('materialPeligroso')?.setValue(true);
      this.myForm.get('materialPeligroso')?.disable();
      this.myForm.get('cveMaterialPeligroso')?.setValidators([Validators.required]);
      this.myForm.get('embalaje')?.setValidators([Validators.required]);
    } else if (material_peligroso === "0,1") {
      this.myForm.get('materialPeligroso')?.setValue(false);
      this.myForm.get('materialPeligroso')?.enable();
      this.myForm.get('cveMaterialPeligroso')?.clearValidators();
      this.myForm.get('embalaje')?.clearValidators();
    } else {
      this.myForm.get('materialPeligroso')?.setValue(false);
      this.myForm.get('cveMaterialPeligroso')?.clearValidators();
      this.myForm.get('embalaje')?.clearValidators();
    }

    this.myForm.get('cveMaterialPeligroso')?.updateValueAndValidity();
    this.myForm.get('embalaje')?.updateValueAndValidity();
    this.myForm.get('descripEmbalaje')?.updateValueAndValidity();

    this.filteredMercancia = [];
    this.selectedIndex = -1;
  }

  onMaterialPeligrosoChange(event: any): void {
    const isChecked = event.target.checked;

    if (isChecked) {
      this.myForm.get('cveMaterialPeligroso')?.setValidators([Validators.required]);
      this.myForm.get('embalaje')?.setValidators([Validators.required]);
    } else {
      this.myForm.get('cveMaterialPeligroso')?.clearValidators();
      this.myForm.get('embalaje')?.clearValidators();
    }

    this.myForm.get('cveMaterialPeligroso')?.updateValueAndValidity();
    this.myForm.get('embalaje')?.updateValueAndValidity();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#claveProdServCP')) {
      this.filteredMercancia = [];
    }
  }

  onMaterialPeligrosoChange1(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.bandera = checkbox.checked;
  }

  // ----------------------------------------------------------------------------

  listMatPeligroso: catMatPeligroso[] = [];
  filteredMatPeligroso: catMatPeligroso[] = [];
  

  onInput2(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Buscando :', query);
    this.buscar3.next(query);
  }
  private BuscarMatPeligroso(query: string): void {
      const control = this.myForm.get('cveMaterialPeligroso');
      if (!control) return;
      if (query.length === 0) {
        control.setErrors(null);
  
        if (control.hasValidator(Validators.required)) {
          control.setValidators([Validators.required]);
        }
        control.updateValueAndValidity();
        this.filteredMatPeligroso = [];
        this.showLoader = false;
        return;
      }
      if (query.length < 2) {
        control.setErrors({ notFound: true });
        this.filteredMatPeligroso = [];
        this.showLoader = false;
        return;
      }
      this.showLoader = true;
      this.mercanciSer.getAllcatMatPeligroso(query).subscribe({
        next: (response: ApiResponseMatPeligroso) => {
          console.log('Respuesta de la API:', response);
          this.filteredMatPeligroso = response.data || [];
          console.log('Productos obtenidos:', this.filteredMatPeligroso);
  
          const exactMatch = this.filteredMatPeligroso.some(producto =>
            producto.clave.toString().toLowerCase() === query ||
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



  selectMatPeligroso(matPeligroso: catMatPeligroso): void {
    this.matPeligrosoDescription = matPeligroso.descripcion;
    this.myForm.get('cveMaterialPeligroso')?.setValue(matPeligroso.clave);
    this.filteredMatPeligroso = [];
    this.selectedIndex = -1;

    this.myForm.get('cveMaterialPeligroso')?.setErrors(null);
    const inputElement = document.getElementById('descripcionMatPeligroso') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = this.matPeligrosoDescription;
    }
  }



  @HostListener('document:click', ['$event'])
  onClickOutside2(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#cveMaterialPeligroso')) {
      this.filteredMatPeligroso = [];
    }
  }
  // -----------------------------------------------------------------
  listClave: catClaveUnidad[] = [];
  filteredClave: catClaveUnidad[] = [];

  

  onInput1(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Buscando :', query);
    this.buscar2.next(query);
  }
  private BuscarClave(query: string): void {
      const control = this.myForm.get('unidad');
      if (!control) return;
      if (query.length === 0) {
        control.setErrors(null);
  
        if (control.hasValidator(Validators.required)) {
          control.setValidators([Validators.required]);
        }
        control.updateValueAndValidity();
        this.filteredClave = [];
        this.showLoader = false;
        return;
      }
      if (query.length < 2) {
        control.setErrors({ notFound: true });
        this.filteredClave = [];
        this.showLoader = false;
        return;
      }
      this.showLoader = true;
      this.mercanciSer.getAllcatClaveUnidad(query).subscribe({
        next: (response: ApiResponseClave) => {
          console.log('Respuesta de la API:', response);
          this.filteredClave = response.data || [];
          console.log('Productos obtenidos:', this.filteredClave);
  
          const exactMatch = this.filteredClave.some(producto =>
            producto.c_claveunidad.toString().toLowerCase() === query ||
            producto.nombre.toLowerCase() === query
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

  

  claveUnidadDescription: string = '';



  selectClave(clave: catClaveUnidad): void {
    this.myForm.get('claveUnidad')?.setValue(clave.c_claveunidad);
    this.myForm.get('unidad')?.setValue(clave.nombre);
    this.claveUnidadDescription = clave.nombre;
    this.filteredClave = [];
    this.selectedIndex = -1;

    this.myForm.get('unidad')?.setErrors(null);
    const inputElement = document.getElementById('claveUnidades') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = this.claveUnidadDescription;
    }
  }



  @HostListener('document:click', ['$event'])
  onClickOutside1(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#unidad')) {
      this.filteredClave = [];
    }
  }

  // -------------------------------------------------------------
  listRmbalaje: catEmbalaje[] = [];
  filteredEmbalaje: catEmbalaje[] = [];

  
  onInput4(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Buscando :', query);
    this.buscar4.next(query);
  }
  private BuscarEmbalaje(query: string): void {
      const control = this.myForm.get('embalaje');
      if (!control) return;
      if (query.length === 0) {
        control.setErrors(null);
  
        if (control.hasValidator(Validators.required)) {
          control.setValidators([Validators.required]);
        }
        control.updateValueAndValidity();
        this.filteredEmbalaje = [];
        this.showLoader = false;
        return;
      }
      if (query.length < 2) {
        control.setErrors({ notFound: true });
        this.filteredEmbalaje = [];
        this.showLoader = false;
        return;
      }
      this.showLoader = true;
      this.mercanciSer.getAllcatEmbalaje(query).subscribe({
        next: (response: ApiResponseMatPeligroso) => {
          console.log('Respuesta de la API:', response);
          this.filteredEmbalaje = response.data || [];
          console.log('Productos obtenidos:', this.filteredEmbalaje);
  
          const exactMatch = this.filteredEmbalaje.some(producto =>
            producto.clave.toString().toLowerCase() === query ||
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

  

  embalajeDescription: string = '';



  selectEmbalaje(embalaje: catEmbalaje): void {
    this.embalajeDescription = embalaje.descripcion;
    this.myForm.get('embalaje')?.setValue(embalaje.clave);
    this.filteredEmbalaje = [];
    this.selectedIndex = -1;

    this.myForm.get('embalaje')?.setErrors(null);
    const inputElement = document.getElementById('embalajes') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = this.embalajeDescription;
    }
  }


  @HostListener('document:click', ['$event'])
  onClickOutside4(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#embalaje')) {
      this.filteredEmbalaje = [];
    }
  }

}
