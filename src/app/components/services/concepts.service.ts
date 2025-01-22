import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ConceptsService {
  private fb = inject(FormBuilder);
  productos: FormArray;

  constructor() { 
    this.productos = this.fb.array([]);

  }


  getProductosFormArray(): FormArray {
    return this.productos;
  }

}
