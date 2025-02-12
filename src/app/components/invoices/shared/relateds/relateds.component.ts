import { Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PATRON_UUID } from '../../../../shared/utils/expressions';
import { ValidatorsService } from '../../../../shared/services/validators.service';
import { RelatedsService } from '../../../services/relateds.service';

@Component({
  selector: 'app-relateds',
  templateUrl: './relateds.component.html',
  styleUrl: './relateds.component.scss'
})
export class RelatedsComponent {
  private relacionService = inject(RelatedsService);
  mostrarTablaR: boolean = false;
  formulario = this.relacionService.getFormRelateds();
  // private validatorsService = inject(ValidatorsService);

  agregarRel(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked; 
    this.mostrarTablaR = isChecked; 
    console.log('Checkbox is:', isChecked ? 'Checked' : 'Unchecked');
  }

  constructor(private fb: FormBuilder) {

  }

  get relaciones(): FormArray {
    return this.formulario.get('relaciones') as FormArray;
  }

  getUuids(row: AbstractControl): FormArray {
    return row.get('uuids') as FormArray;
  }
  

  nuevaRelacion(): FormGroup {
    return this.fb.group({
      relacion: ['', Validators.required],
      uuids: this.fb.array([this.nuevoUuid()]),
    });
  }

  nuevoUuid(): FormGroup {
    return this.fb.group({
      uuid: ['', [Validators.required, Validators.pattern(PATRON_UUID)]],
    });
  }

  addRow(): void {
    this.relaciones.push(this.nuevaRelacion());
  }

  removeRow(index: number): void {
    this.relaciones.removeAt(index);
  }

  addUuid(index: number): void {
    const uuids = this.relaciones.at(index).get('uuids') as FormArray;
    uuids.push(this.nuevoUuid());
  }

  removeUuid(relIndex: number, uuidIndex: number): void {
    const uuids = this.relaciones.at(relIndex).get('uuids') as FormArray;
    uuids.removeAt(uuidIndex);
  }

  getFieldError(control: AbstractControl, field: string): string | null {
    const fieldControl = control.get(field);
    if (!fieldControl) return null;
  
    const errors = fieldControl.errors;
    if (!errors) return null;
  
    if (errors['required']) {
      return 'Este campo es obligatorio.';
    }
    if (errors['pattern']) {
      return 'El UUID no tiene el formato correcto.';
    }
    return null;
  }
  
  public isValidField(form: AbstractControl, field: string): boolean | null {
    const groupControl = form.get(field);
    if (!groupControl) return false;
    return groupControl.touched && groupControl.errors ? true : false;
}

  
  
}
