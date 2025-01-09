import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegimenInterface } from '../../../shared/interfaces/shared.interface';
import { UtilsService } from '../../../shared/services/utils.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { Observable } from 'rxjs';
import { prodServ } from '../../services/prodServ.service';
import { HttpClient } from '@angular/common/http';
import { cat_Clave_Unidad } from '../../services/CatClaveUnidad.service';

@Component({
  selector: 'app-form-products',
  templateUrl: './form-products.component.html',
  styleUrl: './form-products.component.scss'
})
export class FormProductsComponent {
  private fb = inject(FormBuilder);
  listadoRegimen: RegimenInterface[] = [];
  private validatorsService = inject(ValidatorsService);
  private prodServ = inject(prodServ)
  private Unidad = inject(cat_Clave_Unidad)


  filteredClavProdServ$: Observable<any[]> = new Observable();
  filteredClavUnidad$: Observable<any[]> = new Observable();

  constructor(private prodserv: prodServ, private cat_Clave_Unidad: cat_Clave_Unidad) { }
  private http = inject(HttpClient);

  myForm: FormGroup = this.fb.group({
    ClavProdSer: ['', [Validators.required, Validators.minLength(8)]],
    clavUnit: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
    uniDescripcion: ['', [Validators.minLength(1), Validators.maxLength(20)]],
    PrecioUnidad: ['',],
    numIdentificacion: ['',],
    ClavInterna: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    cantidad: ['', [Validators.required]]

  });

  ngOnInit(): void {
  }
  searchClavProdSer(): void {
    const termino = this.myForm.get('ClavProdSer')?.value;
    console.log('Buscando:', termino);

    if (termino && termino.length >= 3) {
      this.filteredClavProdServ$ = this.prodServ.searchClavProdSer(termino);
      this.filteredClavProdServ$.subscribe(response => {
        console.log('Respuesta de la API:', response);
      });
    }
  }
  searchClavUnidad(): void {
    const termino = this.myForm.get('clavUnit')?.value;
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
  closeModal(): void {
    this.myForm.reset();
  }
  onSubmit(): void {
    if (this.myForm.valid) {
      console.log("Formulario válido, guardando datos...");
    } else {
      this.myForm.markAllAsTouched();
    }
  }


}
