import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'any',
})
export class ValidatorsService {
  private patternErrorMessages: Record<string, string> = {
    rfc: 'El RFC ingresado es inválido',
    curp: 'EL CURP ingresado es inválido',
    phone: 'El número de teléfono debe ser de 10 o 14 dígitos',
    account_number: 'El número de cuenta debe contener solo letras y números y tener entre 4 y 18 caracteres',
    email: 'Ingrese un correo electrónico válido',
    password: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial',
    valor_iva: 'El valor debe ser 0 o 16%',
    uuid: 'El uuid no cumple con la estructura correcta'
  };

  public isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;
    const errors = form.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'El campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
        case 'pattern':
          return this.patternErrorMessages[field] || 'Formato inválido';
        case 'generic':
          return 'RFC incorrecto, introduce un RFC válido';
        case 'min':
          return `El valor debe ser mayor o igual a ${errors['min'].min}.`;
        case 'max':
          return `El valor debe ser menor o igual a ${errors['max'].max}.`;
        case 'notEqual':
          return 'Las contraseñas no coinciden';
      }
    }
    return null;
  }

  public isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      if (fieldValue1 !== fieldValue2) {
        formGroup.get(field2)?.setErrors({ notEqual: true });
        return { notEqual: true };
      }

      formGroup.get(field2)?.setErrors(null);
      return null;
    };
  }
}
