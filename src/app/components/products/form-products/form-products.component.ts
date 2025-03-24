import { Component, EventEmitter, HostListener, inject, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegimenInterface } from '../../../shared/interfaces/shared.interface';
import { UtilsService } from '../../../shared/services/utils.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { Observable } from 'rxjs';
import { prodServ } from '../../services/prodServ.service';
import { HttpClient } from '@angular/common/http';
import { cat_Clave_Unidad } from '../../services/CatClaveUnidad.service';
import { AuthService } from '../../services/auth.service';
import { productoServicio } from '../../services/productoServicio.service';
import { ApiResponseProducto, ApiResponseUnidad, catproducto, catUnidad, ProductInterface, ProductListResponseInterface, ProductResponseInterface } from '../../interfaces/producto.interface';
import Swal from 'sweetalert2';
import { debounceTime, Subject } from 'rxjs';

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
  // private prodServ = inject(prodServ)
  private productoservicio = inject(productoServicio)

  private authService = inject(AuthService);
  // filteredClavProdServ$: Observable<any[]> = new Observable();
  // filteredClavUnidad$: Observable<any[]> = new Observable();

  constructor(private cat_Clave_Unidad: cat_Clave_Unidad

  ) { }
  private http = inject(HttpClient);

  myForm: FormGroup = this.fb.group({
    product_key: ['', [Validators.required]],
    // descripcion_producto:['', [Validators.required]],
    unit: ['', [Validators.required, Validators.minLength(2)]],
    unit_description: ['', [Validators.minLength(1), Validators.maxLength(20)]],
    unit_price: ['',],
    identifier_number: ['', [Validators.required, Validators.maxLength(20)]],
    internal_key: ['', [Validators.required]],
    description: ['', [Validators.required]],
    quantity: ['', [Validators.required]],
    status: [true],

  });
  ngOnChanges(): void {
    if (this.productoHijo) {
      this.idProducto = this.productoHijo?.id || '0';
      this.buttonTitle = this.idProducto !== '0' ? 'Actualizar' : 'Crear';
      this.myForm.patchValue({
        ...this.productoHijo,
        status: this.productoHijo.status ?? true,
      });
    } else {
      this.myForm.reset({ status: true });
    }
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
          this.resetProduct();
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

  // ngOnInit(): void {
  //   this.loadProducto();
  //   this.loadUnidad();
  //   this.buscar.pipe(debounceTime(500)).subscribe(query => {
  //     this.filterProducts(query);
  //   });
  //   this.buscarUnidad.pipe(debounceTime(500)).subscribe(query => {
  //     this.filterUnidad(query);
  //   });


  // }
  // loadProducto(): void {
  //   this.productoservicio.getAllCatProducto().subscribe({
  //     next: (response: ApiResponseProducto) => {
  //       console.log('Datos recibidos desde el servicio:', response);
  //       if (Array.isArray(response.data)) {
  //         this.listProducto = response.data;
  //         console.log('listProducto:', this.listProducto);
  //       } else {
  //         console.error('La respuesta no contiene un array en "data":', response.data);
  //         this.listProducto = [];
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error al cargar los datos:', err);
  //       this.showLoader = false;
  //     }
  //   });
  // }

  // onInput(event: any): void {
  //   const query = (event.target.value || '').trim().toLowerCase();
  //   console.log('Texto ingresado:', query);
  //   this.buscar.next(query);
  // }
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
  // private filterProducts(query: string): void {
  //   const control = this.myForm.get('product_key');
  //   if (!control) return;

  //   if (query.length === 0) {
  //     control.setErrors(null);
  //     if (control.hasValidator(Validators.required)) {
  //       control.setValidators([Validators.required]);
  //     }
  //     control.updateValueAndValidity();
  //     this.filteredProducto = [];
  //     this.showLoader = false;
  //     return;
  //   }

  //   if (query.length < 4) {
  //     control.setErrors({ notFound: true });
  //     this.filteredProducto = [];
  //     this.showLoader = false;
  //     return;
  //   }

  //   this.showLoader = true;

  //   if (Array.isArray(this.listProducto)) {
  //     this.filteredProducto = this.listProducto.filter((producto) => {
  //       const clave = producto.c_ClaveProdServ.toString().toLowerCase();
  //       const descripcion = producto.descripcion.toLowerCase();
  //       return clave.includes(query) || descripcion.includes(query);
  //     });

  //     console.log('Productos filtrados:', this.filteredProducto);

  //     const exactMatch = this.listProducto.some(producto =>
  //       producto.c_ClaveProdServ.toString().toLowerCase() === query ||
  //       producto.descripcion.toLowerCase() === query
  //     );

  //     if (!exactMatch) {
  //       control.setErrors({ notFound: true });
  //     } else {
  //       control.setErrors(null);
  //     }
  //   }

  //   this.showLoader = false;
  // }



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
        this.selectUnidad(this.filteredUnidad[this.selectedIndex]);



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

  // loadUnidad(): void {
  //   this.productoservicio.getAllCatUnidad().subscribe({
  //     next: (response: ApiResponseUnidad) => {
  //       console.log('Datos recibidos desde el servicio:', response);
  //       if (Array.isArray(response.data)) {
  //         this.listUnidad = response.data;
  //         console.log('listUnidad:', this.listUnidad);
  //       } else {
  //         console.error('La respuesta no contiene un array en "data":', response.data);
  //         this.listUnidad = [];
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error al cargar los datos:', err);
  //       this.showLoader = false;
  //     }
  //   });
  // }

  onInput1(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Texto ingresado:', query);
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
  
    if (query.length < 4) {
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


  // claveProdServUnidad: string = '';

  // selectUnidad(unidad: catUnidad): void {
  //   console.log(unidad);
  //   let { c_claveunidad, nombre } = unidad;
  //   this.myForm.get('unidad')?.setValue(c_claveunidad);
  //   this.claveProdServUnidad = nombre;
  //   this.filteredUnidad = [];
  //   this.selectedIndex = -1;
  // }
  claveProdServUnidad: string = '';
  selectUnidad(unidad: catUnidad): void {
    this.claveProdServUnidad = unidad.nombre;
    this.myForm.get('unit')?.setValue(unidad.c_claveunidad);
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
    }
  }

}
