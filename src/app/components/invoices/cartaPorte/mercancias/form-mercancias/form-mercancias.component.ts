import { Component, EventEmitter, HostListener, inject, Inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidatorsService } from "../../../../../shared/services/validators.service";
import { ApiResponse, ApiResponseClave, ApiResponseEmbalaje, ApiResponseMatPeligroso, catClaveUnidad, catEmbalaje, catMatPeligroso, CatProdServCP, MercanciaInterface, MercanciaListResponseInterface } from "../../../../interfaces/mercancias.interface";
import { AuthService } from "../../../../services/auth.service";
import { MercanciasService } from "../../../../services/mercancias.service";
import { DIMENSIONES_REGEX } from "../../../../../shared/utils/expressions";


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
  bandera:boolean = false;

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
    if (this.myForm.valid) {
      this.showLoader = true;
      const uuidCompany = this.authService.getUuid();
      console.log('UUID de la empresa:', uuidCompany);

      const formData = {
        ...this.myForm.value,
        uuid_company: uuidCompany || '',
      };

      const action = this.idMercancia !== 0
        ? this.mercanciSer.updatemercancias(this.idMercancia, formData)
        : this.mercanciSer.createmercancias(formData);

      action.subscribe({
        next: (response) => {
          this.respuesta.emit(response.data);
          this.resetMercancia();
          this.showLoader = false;
        },
        error: (err) => {
          console.error('Error al enviar los datos:', err);
          this.showLoader = false;
        },
      });
    } else {
      this.myForm.markAllAsTouched();
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
  ngOnInit(): void {
    this.loadMercancia();
    this.loadClave();
    this.loadMatPeligroso();
   this. loadEmbalaje();
  }
  loadMercancia(): void {
    this.mercanciSer.getAllProductsAndServices().subscribe({
      next: (response: ApiResponse) => {  
        console.log('Datos recibidos desde el servicio:', response);
        if (Array.isArray(response.data)) {
          this.listMercancia = response.data;
          console.log('listMercancia:', this.listMercancia);
        } else {
          console.error('La respuesta no contiene un array en "data":', response.data);
          this.listMercancia = []; 
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
        this.showLoader = false;
      }
    });
  }

onInput(event: any): void {
  const query = event.target.value.toLowerCase();
  console.log('Texto ingresado:', query);
  if (query.length >= 4) {
    this.showLoader = true;
    setTimeout(() => {
      if (Array.isArray(this.listMercancia)) {
        this.filteredMercancia = this.listMercancia.filter((mercancia) =>
          mercancia.c_ClaveProdServ.toLowerCase().includes(query) || 
          mercancia.descripcion.toLowerCase().includes(query)
        );
        console.log('Mercancia filtradas:', this.filteredMercancia);
      }
      this.showLoader = false;
    }, 1000);  
  } else {
    this.filteredMercancia = [];
    this.showLoader = false;  
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
        this.selectClave(this.filteredClave[this.selectedIndex]);
        this.selectMatPeligroso(this.filteredMatPeligroso[this.selectedIndex]);
        this.selectEmbalaje(this.filteredEmbalaje[this.selectedIndex]);
      }
    }
  }
  claveProdServDescription: string = '';

  selectMercancia(Mercancia: CatProdServCP): void {
    console.log(Mercancia);
    let { c_ClaveProdServ, descripcion, material_peligroso } = Mercancia;
  
    this.myForm.get('claveProdServCP')?.setValue(c_ClaveProdServ); 
    this.claveProdServDescription = descripcion; 
    
    this.bandera = material_peligroso === "0,1" || material_peligroso === "1";
  
    if (material_peligroso === "1") {
      this.myForm.get('materialPeligroso')?.setValue(true);
      this.myForm.get('materialPeligroso')?.disable(); 
      this.myForm.get('cveMaterialPeligroso')?.setValidators([Validators.required]);
      this.myForm.get('embalaje')?.setValidators([Validators.required]);
      this.myForm.get('descripEmbalaje')?.setValidators([Validators.required]);
    } else if (material_peligroso === "0,1") {
      this.myForm.get('materialPeligroso')?.setValue(false);
      this.myForm.get('materialPeligroso')?.enable();
      this.myForm.get('cveMaterialPeligroso')?.clearValidators();
      this.myForm.get('embalaje')?.clearValidators();
      this.myForm.get('descripEmbalaje')?.clearValidators();
    } else {
      this.myForm.get('materialPeligroso')?.setValue(false);
      this.myForm.get('materialPeligroso')?.disable(); 
      this.myForm.get('cveMaterialPeligroso')?.setValidators([Validators.required]);
      this.myForm.get('embalaje')?.setValidators([Validators.required]);
      this.myForm.get('descripEmbalaje')?.setValidators([Validators.required]);
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
      this.myForm.get('descripEmbalaje')?.setValidators([Validators.required]);
    } else {
      this.myForm.get('cveMaterialPeligroso')?.clearValidators();
      this.myForm.get('embalaje')?.clearValidators();
      this.myForm.get('descripEmbalaje')?.clearValidators();
    }
  
    this.myForm.get('cveMaterialPeligroso')?.updateValueAndValidity();
    this.myForm.get('embalaje')?.updateValueAndValidity();
    this.myForm.get('descripEmbalaje')?.updateValueAndValidity();
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
  loadMatPeligroso(): void {
    this.mercanciSer.getAllcatMatPeligroso().subscribe({
      next: (response: ApiResponseMatPeligroso) => {
        console.log('Datos de Material Peligroso recibidos:', response.data);
        if (Array.isArray(response.data)) {
          this.listMatPeligroso = response.data;
        } else {
          console.error('La respuesta no contiene un array en "data":', response.data);
          this.listMatPeligroso = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
      }
    });
  }
  
  
  onInput2(event: any): void {
    const query = event.target.value?.toLowerCase() || '';
    console.log('Texto ingresado:', query);
    if (query.length >= 3) {
      this.showLoader = true;  
      setTimeout(() => {
        if (Array.isArray(this.listMatPeligroso)) {
          this.filteredMatPeligroso = this.listMatPeligroso.filter((lista) => {
            const clave = lista.clave ? lista.clave.toLowerCase() : '';
            const descripcion = lista.descripcion ? lista.descripcion.toLowerCase() : '';
            return clave.includes(query) || descripcion.includes(query);
          });
          console.log('Claves filtradas:', this.filteredMatPeligroso);
        }
        this.showLoader = false;
      }, 1000); 
    } else {
      this.filteredMatPeligroso = [];
      this.showLoader = false;
    }
  }
  
  matPeligrosoDescription: string = '';
  
  selectMatPeligroso(matPeligroso: catMatPeligroso): void {
    this.myForm.get('cveMaterialPeligroso')?.setValue(matPeligroso.clave);
    this.matPeligrosoDescription = matPeligroso.descripcion;
    this.filteredMatPeligroso = [];
    this.selectedIndex = -1;
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
  loadClave(): void {
    this.mercanciSer.getAllcatClaveUnidad().subscribe({
      next: (response: ApiResponseClave) => {
        if (Array.isArray(response.data)) {
          this.listClave = response.data;
        } else {
          console.error('La respuesta no contiene un array en "data":', response.data);
          this.listClave = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
      }
    });
  }
  
  onInput1(event: any): void {
    const query = event.target.value?.toLowerCase() || '';
    console.log('Texto ingresado:', query);
  
    if (query.length >= 2) {
      this.showLoader = true; 
  
      setTimeout(() => {
        if (Array.isArray(this.listClave)) {
          this.filteredClave = this.listClave.filter((listClave) =>
            listClave.c_claveunidad.toLowerCase().includes(query) || 
            listClave.nombre.toLowerCase().includes(query)
          );
          console.log('Claves filtradas:', this.filteredClave);
        }
  
        this.showLoader = false;
      }, 1000); 
    } else {
      this.filteredClave = [];
      this.showLoader = false;
    }
  }
  
  claveUnidadDescription: string = '';
  selectClave(clave: catClaveUnidad): void {
    this.myForm.get('claveUnidad')?.setValue(clave.c_claveunidad); 
    this.myForm.get('unidad')?.setValue(clave.nombre);
    this.claveUnidadDescription = clave.nombre; 
    this.filteredClave = [];
    this.selectedIndex = -1;
  }
  

  @HostListener('document:click', ['$event'])
  onClickOutside1(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#claveUnidad')) {
      this.filteredClave = [];
    }
  }

  // -------------------------------------------------------------
  listRmbalaje: catEmbalaje[] = [];
  filteredEmbalaje: catEmbalaje[] = []; 
  loadEmbalaje(): void {
    this.mercanciSer.getAllcatEmbalaje().subscribe({
      next: (response: ApiResponseEmbalaje) => {
        if (Array.isArray(response.data)) {
          this.listRmbalaje = response.data;
        } else {
          console.error('La respuesta no contiene un array en "data":', response.data);
          this.listRmbalaje = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
      }
    });
  }
  
  onInput4(event: any): void {
    const query = event.target.value?.toLowerCase() || '';
    console.log('Texto ingresado:', query);
  
    if (query.length >= 2) {
      this.showLoader = true;  
  
      setTimeout(() => {
        if (Array.isArray(this.listRmbalaje)) {
          this.filteredEmbalaje = this.listRmbalaje.filter((listRmbalaje) =>
            listRmbalaje.clave.toLowerCase().includes(query) || 
            listRmbalaje.descripcion.toLowerCase().includes(query)
          );
          console.log('Claves filtradas:', this.filteredEmbalaje);
        }
  
        this.showLoader = false;
      }, 1000); 
    } else {
      this.filteredEmbalaje = [];
      this.showLoader = false;
    }
  }
  embalajeDescription: string = '';
  selectEmbalaje(embalaje: catEmbalaje): void {
    this.myForm.get('embalaje')?.setValue(embalaje.clave); 
    this.embalajeDescription = embalaje.descripcion;
    this.filteredEmbalaje = [];
    this.selectedIndex = -1;
  }
  

  @HostListener('document:click', ['$event'])
  onClickOutside4(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#embalaje')) {
      this.filteredEmbalaje = [];
    }
  }

}
