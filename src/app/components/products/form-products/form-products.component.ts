import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
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
import { ProductInterface, ProductListResponseInterface, ProductResponseInterface } from '../../interfaces/producto.interface';
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
  private prodServ = inject(prodServ)
  private productoservicio=inject(productoServicio)

  private authService = inject(AuthService);
  filteredClavProdServ$: Observable<any[]> = new Observable();
  filteredClavUnidad$: Observable<any[]> = new Observable();

  constructor( private cat_Clave_Unidad: cat_Clave_Unidad
    
  ) { }
  private http = inject(HttpClient);

  myForm: FormGroup = this.fb.group({
    product_key: ['', [Validators.required, Validators.minLength(8)]],
    unit: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
    unit_description: ['', [Validators.minLength(1), Validators.maxLength(20)]],
    unit_price: ['',],
    identifier_number: ['',[Validators.required,]],
    internal_key: ['', [Validators.required]],
    description: ['', [Validators.required]],
    quantity: ['', [Validators.required]],
   status: [true],

  });

  ngOnInit(): void {
  }

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


  searchClavProdSer(): void {
    const termino = this.myForm.get('product_key')?.value;
    console.log('Buscando:', termino);

    if (termino && termino.length >= 3) {
      this.filteredClavProdServ$ = this.prodServ.searchClavProdSer(termino);
      this.filteredClavProdServ$.subscribe(response => {
        console.log('Respuesta de la API:', response);
      });
    }
  }
  searchClavUnidad(): void {
    const termino = this.myForm.get('unit')?.value;
    console.log('Buscando:', termino);

    if (termino && termino.length >= 2) {
      this.filteredClavUnidad$ = this.cat_Clave_Unidad.searchClavUnidad(termino);
      this.filteredClavUnidad$.subscribe(Response => {
        console.log('Respuesta de la API:', Response);
      });
    }
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
          this.myForm.reset();
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
    this.myForm.reset();
    this.idProducto = '0';
    this.buttonTitle = 'Crear';
  }
  

}
