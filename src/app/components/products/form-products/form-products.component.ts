import { Component, EventEmitter, HostListener, inject, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegimenInterface } from '../../../shared/interfaces/shared.interface';
import { UtilsService } from '../../../shared/services/utils.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { max, Observable } from 'rxjs';
import { prodServ } from '../../services/prodServ.service';
import { HttpClient } from '@angular/common/http';
import { cat_Clave_Unidad } from '../../services/CatClaveUnidad.service';
import { AuthService } from '../../services/auth.service';
import { productoServicio } from '../../services/productoServicio.service';
import { ApiResponseProducto, ApiResponseUnidad, catproducto, catUnidad, ProductInterface, ProductListResponseInterface, ProductResponseInterface } from '../../interfaces/producto.interface';
import Swal from 'sweetalert2';
import { debounceTime, Subject } from 'rxjs';
import { DECIMALESPRODU } from '../../../shared/utils/expressions';

@Component({
  selector: 'app-form-products',
  templateUrl: './form-products.component.html',
  styleUrl: './form-products.component.scss'
})
export class FormProductsComponent {
  @Input() productoHijo!: ProductInterface;
  @Output() respuesta = new EventEmitter<ProductInterface>();
  showLoader = false;
  private fb = inject(FormBuilder);
  buttonTitle: string = 'Crear';
  idProducto: string = '';
  listadoRegimen: RegimenInterface[] = [];
  private validatorsService = inject(ValidatorsService);
  private productoservicio = inject(productoServicio)

  private authService = inject(AuthService);
 

  constructor(private cat_Clave_Unidad: cat_Clave_Unidad

  ) { }
  private http = inject(HttpClient);

  myForm: FormGroup = this.fb.group({
    product_key: ['', [Validators.required]],
    // descripcion_producto:['', [Validators.required]],
    unit: ['', [Validators.required, Validators.minLength(2)]],
    unit_description: ['', [Validators.minLength(1), Validators.maxLength(20)]],
    unit_price: ['',[Validators.pattern(DECIMALESPRODU)]],
    identifier_number: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
    internal_key: ['', [Validators.required,Validators.maxLength(20),Validators.minLength(5)]],
    description: ['', [Validators.required]],
    quantity: ['', [Validators.required,Validators.pattern(DECIMALESPRODU)]],
    status: [true],
  });
  // ngOnChanges(): void {
  //   if (this.productoHijo) {
  //     this.idProducto = this.productoHijo?.id || '0';
  //     this.buttonTitle = this.idProducto !== '0' ? 'Actualizar' : 'Crear';
  //     this.myForm.patchValue({
  //       ...this.productoHijo,
  //       status: this.productoHijo.status ?? true,
  //     });
  //   } else {
  //     this.myForm.reset({ status: true });
  //   }
  // }
  ngOnChanges(): void {
    if (this.productoHijo) {
      this.idProducto = this.productoHijo?.id || '0';
      this.buttonTitle = this.idProducto !== '0' ? 'Actualizar' : 'Crear';
  
      this.myForm.patchValue({
        ...this.productoHijo,
        status: this.productoHijo.status ?? true,
      });
      this.claveProdServDescription = '';
      this.claveProdServUnidad = '';
      if (this.idProducto !== '0' && this.productoHijo.product_key) {
        this.obtenerDescripcionProducto(this.productoHijo.product_key);
      }
      if (this.productoHijo.unit) {
        this.obtenerDescripcionUnidad(this.productoHijo.unit);
      }
      
    } else {
      this.myForm.reset({ status: true });
      this.claveProdServDescription = ''; 
    }
  }
  obtenerDescripcionUnidad(clave: string): void {
    if (!clave) {
      this.claveProdServUnidad = '';
      return;
    }
  
    this.productoservicio.getAllCatUnidad(clave).subscribe({
      next: (response: ApiResponseUnidad) => {
        const unidadEncontrada = response.data.find(u => u.c_claveunidad.toString() === clave);
        if (unidadEncontrada) {
          this.claveProdServUnidad = unidadEncontrada.nombre;
          this.myForm.patchValue({ unit: clave });
        } else {
          this.claveProdServUnidad = '';
        }
      },
      error: (err) => {
        console.error('Error al obtener la descripción de la unidad:', err);
        this.claveProdServUnidad = '';
      }
    });
  }
  obtenerDescripcionProducto(clave: string): void {
    if (!clave) {
      this.claveProdServDescription = '';
      return;
    }
    this.productoservicio.getAllCatProducto(clave).subscribe({
      next: (response: ApiResponseProducto) => {
        const productoEncontrado = response.data.find(p => p.c_ClaveProdServ.toString() === clave);
        if (productoEncontrado) {
          this.claveProdServDescription = productoEncontrado.descripcion; 
          this.myForm.patchValue({ product_key: clave }); 
        } else {
          this.claveProdServDescription = ''; 
        }
      },
      error: (err) => {
        console.error('Error al obtener la descripción del producto:', err);
        this.claveProdServDescription = ''; 
      }
    });
  }
  
  get currentProducto(): ProductInterface {
    const produts = this.myForm.value as ProductInterface;
    console.log(produts)
    return produts;
  }



  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
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

      const action = this.idProducto !== '0'
        ? this.productoservicio.updateProduct(this.idProducto, formData)
        : this.productoservicio.createProduct(formData);

      action.subscribe({
        next: (response) => {
          this.respuesta.emit(response.data);
          // this.resetProduct();
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
  closeModal(): void {
    this.resetProduct();
    this.idProducto = '0';
    this.buttonTitle = 'Crear';
  }
  resetProduct(): void {
    this.myForm.reset({
      product_key: "",
      unit: "",
      unit_description: "",
      unit_price: "",
      identifier_number: "",
      internal_key: "",
      description: "",
      quantity: "",
      status: true
    })
    this.claveProdServDescription = '';
  }
  buscar = new Subject<string>();
  buscarUnidad = new Subject<string>();

  listProducto: catproducto[] = [];
  filteredProducto: catproducto[] = [];
  selectedIndex: number = -1;

  ngOnInit(): void {
    this.buscar.pipe(
      debounceTime(500),
    ).subscribe((query: string) => {
      this.filterProducts(query);
    });
    this.buscarUnidad.pipe(
      debounceTime(500),
    ).subscribe((query: string) => {
      this.filterUnidad(query);
    });
  }

  
  onInput(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Buscando producto:', query);
    this.buscar.next(query);
  }

  private filterProducts(query: string): void {
    const control = this.myForm.get('product_key');
    if (!control) return;

    if (query.length === 0) {
      control.setErrors(null);
      this.filteredProducto = [];
      if (control.hasValidator(Validators.required)) {
        control.setValidators([Validators.required]);
      }
      control.updateValueAndValidity();
      this.showLoader = false;
      return;
    }

    if (query.length < 4) {
      control.setErrors({ notFound: true });
      this.filteredProducto = [];
      this.showLoader = false;
      return;
    }

    this.showLoader = true;
    this.productoservicio.getAllCatProducto(query).subscribe({
      next: (response: ApiResponseProducto) => {
        this.filteredProducto = response.data || [];
        console.log('Productos obtenidos:', this.filteredProducto);

        const exactMatch = this.filteredProducto.some(producto =>
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
      if (this.selectedIndex < this.filteredProducto.length - 1) {
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
        this.selectProducto(this.filteredProducto[this.selectedIndex]);
        // this.selectUnidad(this.filteredUnidad[this.selectedIndex]);



      }
    }
  }
  claveProdServDescription: string = '';


  selectProducto(Producto: catproducto): void {
    this.claveProdServDescription = Producto.descripcion;
    this.myForm.get('product_key')?.setValue(Producto.c_ClaveProdServ.toString());
    this.filteredProducto = [];
    this.selectedIndex = -1;

    this.myForm.get('product_key')?.setErrors(null);
    const inputElement = document.getElementById('product_keys') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = this.claveProdServDescription;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#product_key')) {
      this.filteredProducto = [];
    }
  }


  // -------------------------------------------------------------------
  listUnidad: catUnidad[] = [];
  filteredUnidad: catUnidad[] = [];
  hasSelected: boolean = false;
  hasTyped: boolean = false;
  

  onInput1(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Texto ingresado:', query);
    this.hasTyped = query.length > 0;
    this.hasSelected = false; 
    this.buscarUnidad.next(query);
  }
  private filterUnidad(query: string): void {
    const control = this.myForm.get('unit');
    if (!control) return;
  
    if (query.length === 0) {
      control.setErrors(null);
      if (control.hasValidator(Validators.required)) {
        control.setValidators([Validators.required]);
      }
      control.updateValueAndValidity();
      this.filteredUnidad = [];
      this.showLoader = false;
      return;
    }
  
    if (query.length < 3) {
      control.setErrors({ notFound: true });
      this.filteredUnidad = [];
      this.showLoader = false;
      return;
    }
  
    this.showLoader = true;
  
    this.productoservicio.getAllCatUnidad(query).subscribe({
      next: (response: ApiResponseUnidad) => {
        if (Array.isArray(response.data)) {
          this.filteredUnidad = response.data;  // Asignar las unidades filtradas
          console.log('Unidades filtradas:', this.filteredUnidad);
  
          const exactMatch = this.filteredUnidad.some((uni) =>
            uni.c_claveunidad.toString().toLowerCase() === query ||
            uni.nombre.toLowerCase() === query
          );
  
          if (!exactMatch) {
            control.setErrors({ notFound: true });
          } else {
            control.setErrors(null);
          }
        }
        this.showLoader = false;
      },
      error: (err) => {
        console.error('Error al cargar las unidades:', err);
        this.showLoader = false;
      }
    });
  }
  

  onKeyDown2(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      if (this.selectedIndex < this.filteredUnidad.length - 1) {
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
        this.selectUnidad(this.filteredUnidad[this.selectedIndex]);



      }
    }
  }


  claveProdServUnidad: string = '';
  selectUnidad(unidad: catUnidad): void {
    this.claveProdServUnidad = unidad.nombre;
    this.myForm.get('unit')?.setValue(unidad.c_claveunidad);
    this.hasSelected = true; // Se ha seleccionado una opción
  this.hasTyped = false; 
    this.filteredUnidad = [];
    this.selectedIndex = -1;

    this.myForm.get('unit')?.setErrors(null);
    const inputElement = document.getElementById('unidad') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = this.claveProdServUnidad;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside2(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#unit')) {
      this.filteredUnidad = [];
      if (this.hasTyped && !this.hasSelected) {
        this.myForm.get('unit')?.setErrors({ notSelected: true });
      }
    }
  }

  validateNumberInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (!/^\d$/.test(event.key) || input.value.length >= 30) {
      event.preventDefault();
    }
  }
}
