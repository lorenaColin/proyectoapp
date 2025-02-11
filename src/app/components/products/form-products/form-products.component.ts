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
  filteredClavProdServ$: Observable<any[]> = new Observable();
  filteredClavUnidad$: Observable<any[]> = new Observable();

  constructor(private cat_Clave_Unidad: cat_Clave_Unidad

  ) { }
  private http = inject(HttpClient);

  myForm: FormGroup = this.fb.group({
    product_key: ['', [Validators.required]],
    unit: ['', [Validators.required, Validators.minLength(2)]],
    unit_description: ['', [Validators.minLength(1), Validators.maxLength(20)]],
    unit_price: ['',],
    identifier_number: ['', [Validators.required,]],
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
  listProducto: catproducto[] = [];
  filteredProducto: catproducto[] = [];
  selectedIndex: number = -1;
  ngOnInit(): void {
    this.loadProducto();
    this.loadUnidad();

  }
  loadProducto(): void {
    this.productoservicio.getAllCatProducto().subscribe({
      next: (response: ApiResponseProducto) => {
        console.log('Datos recibidos desde el servicio:', response);
        if (Array.isArray(response.data)) {
          this.listProducto = response.data;
          console.log('listProducto:', this.listProducto);
        } else {
          console.error('La respuesta no contiene un array en "data":', response.data);
          this.listProducto = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
        this.showLoader = false;
      }
    });
  }
  // onInput(event: any): void {
  //   const query = event.target.value.toLowerCase();
  //   console.log('Texto ingresado:', query);
  //   if (query.length >= 4) {
  //     this.showLoader = true;
  //     setTimeout(() => {
  //       if (Array.isArray(this.listProducto)) {
  //         this.filteredProducto = this.listProducto.filter((mercancia) =>
  //           mercancia.c_ClaveProdServ.toLowerCase().includes(query) || 
  //           mercancia.descripcion.toLowerCase().includes(query)
  //         );
  //         console.log('Mercancia filtradas:', this.filteredProducto);
  //       }
  //       this.showLoader = false;
  //     }, 1000);  
  //   } else {
  //     this.filteredProducto = [];
  //     this.showLoader = false;  
  //   }
  // }
  // onInput(event: any): void {
  //   const query = event.target.value.toLowerCase();
  //   console.log('Texto ingresado:', query);
  
  //   if (query.length >= 4) {
  //     this.showLoader = true;
  //     setTimeout(() => {
  //       if (Array.isArray(this.listProducto)) {
  //         this.filteredProducto = this.listProducto.filter((Producto) => {
  //           const clave = Producto.c_ClaveProdServ.toString();
  //           const descripcion = Producto.descripcion.toLowerCase();
  //           return clave.includes(query) || descripcion.includes(query);
  //         });
  //         console.log('Productos filtrados:', this.filteredProducto);
  
  //         if (this.filteredProducto.length === 0) {
  //           this.myForm.get('product_key')?.setErrors({ notFound: true });
  //         } else {
  //           this.myForm.get('product_key')?.setErrors(null);
  //         }
  
  //         const value = this.myForm.get('product_key')?.value;
  //         const productExists = this.filteredProducto.some(product => 
  //           product.c_ClaveProdServ.toString() === value
  //         );
          
  //         if (this.filteredProducto.length === 0) {
  //           this.myForm.get('product_key')?.setErrors({ notFound: true });
  //         } else {
  //           this.myForm.get('product_key')?.setErrors(null);
  //         }
  //       }
  //       this.showLoader = false;
  //     }, 1000);
  //   } else {
  //     this.filteredProducto = [];
  //     this.showLoader = false;
  //     this.myForm.get('product_key')?.setErrors(null);
  //   }
  // }
  onInput(event: any): void {
    const query = event.target.value.toLowerCase();
    console.log('Texto ingresado:', query);
    if (query.length >= 4) {
      this.showLoader = true;
      setTimeout(() => {
        if (Array.isArray(this.listProducto)) {
          this.filteredProducto = this.listProducto.filter((Producto) => {
            const clave = Producto.c_ClaveProdServ.toString();
            const descripcion = Producto.descripcion.toLowerCase();
            return clave.includes(query) || descripcion.includes(query);
          });
          console.log('Productos filtrados:', this.filteredProducto);
          const value = this.myForm.get('product_key')?.value;
          const selectedProduct = this.filteredProducto.find(product =>
            product.c_ClaveProdServ.toString() === value
          );
          if (selectedProduct) {
            this.claveProdServDescription = selectedProduct.descripcion;
          }
          this.myForm.get('product_key')?.setErrors(this.filteredProducto.length === 0 ? { notFound: true } : null);
        }
        this.showLoader = false;
      }, 1000);
    } else {
      this.filteredProducto = [];
      this.showLoader = false;
      this.myForm.get('product_key')?.setErrors(null);
    }
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
        this.selectUnidad(this.filteredUnidad[this.selectedIndex]);



      }
    }
  }
  claveProdServDescription: string = '';

  // selectProducto(Producto: catproducto): void {
  //   console.log(Producto);
  //   let { c_ClaveProdServ, descripcion } = Producto;

  //   this.myForm.get('product_key')?.setValue(c_ClaveProdServ.toString());
  //   this.claveProdServDescription = descripcion;
  //   this.filteredProducto = [];
  //   this.selectedIndex = -1;
  // }
  selectProducto(Producto: catproducto): void {
    console.log(Producto);
    let { c_ClaveProdServ, descripcion } = Producto;
  
    this.claveProdServDescription = descripcion;
  
    this.filteredProducto = [];
    this.selectedIndex = -1;
  
    const productExists = this.listProducto.some(product =>
      product.c_ClaveProdServ.toString() === c_ClaveProdServ.toString()
    );
  
    if (!productExists) {
      this.myForm.get('product_key')?.setErrors({ notFound: true });
    } else {
    this.myForm.get('product_key')?.setValue(c_ClaveProdServ.toString());

      this.myForm.get('product_key')?.setErrors(null);
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

  loadUnidad(): void {
    this.productoservicio.getAllCatUnidad().subscribe({
      next: (response: ApiResponseUnidad) => {
        console.log('Datos recibidos desde el servicio:', response);
        if (Array.isArray(response.data)) {
          this.listUnidad = response.data;
          console.log('listUnidad:', this.listUnidad);
        } else {
          console.error('La respuesta no contiene un array en "data":', response.data);
          this.listUnidad = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
        this.showLoader = false;
      }
    });
  }

  onInput1(event: any): void {
    const query = event.target.value.toLowerCase();
    console.log('Texto ingresado:', query);

    if (query.length >= 4) {
      this.showLoader = true;

      setTimeout(() => {
        if (Array.isArray(this.listUnidad)) {
          this.filteredUnidad = this.listUnidad.filter((unidad) => {
            const clave = unidad.c_claveunidad.toString();
            const descripcion = unidad.nombre.toLowerCase();
            return clave.includes(query) || descripcion.includes(query);
          });
          console.log('Unidades filtradas:', this.filteredUnidad);

          if (this.filteredUnidad.length === 0) {
            this.myForm.get('unit')?.setErrors({ notFound: true });

          } else {
            this.myForm.get('unit')?.setErrors(null);
          }
        }

        this.showLoader = false;
      }, 1000);
    } else {
      this.filteredUnidad = [];
      this.showLoader = false;
      this.myForm.get('unit')?.setErrors(null);
    }
  }






  claveProdServUnidad: string = '';

  selectUnidad(unidad: catUnidad): void {
    console.log(unidad);
    let { c_claveunidad, nombre } = unidad;
    this.myForm.get('unidad')?.setValue(c_claveunidad);
    this.claveProdServUnidad = nombre;
    this.filteredUnidad = [];
    this.selectedIndex = -1;
  }






  @HostListener('document:click', ['$event'])
  onClickOutside1(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#unidad')) {
      this.filteredProducto = [];
    }
  }

}
