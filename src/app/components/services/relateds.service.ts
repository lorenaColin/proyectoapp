import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RelatedsService {

  formulario: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      relaciones: this.fb.array([]),
    });
  }

    getFormRelateds(): FormGroup {
      return this.formulario;
    }
}
