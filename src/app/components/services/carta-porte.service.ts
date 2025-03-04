import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CartaPorteService {
  formInvoice: FormGroup;
autotransporte:FormGroup
  constructor(private fb: FormBuilder) {
    this.formInvoice = this.fb.group({
      selectIstmo: [''],
      uPoloOrigen: [''],
      uPoloDestino: [''],
      serieFolio: [''],
      ubicaciones: this.fb.array([]),
      mercancias: this.fb.array([]),
     
      remolques: this.fb.group({
        sAmbient:[''],
        placaRem:[''],
        sAmbient1:[''],
        placaRem1:[''],
      }),
      seguros: this.fb.group({
        sAmbient:[''],
        sCarge:[''],
        pSeguro:[''],
      }),
      figuras: this.fb.array([]),
    });
   this.autotransporte=this.fb.group({
      placa:[''],
      PermSCT2:[''],
      NumPermisoSCT:[''],
      aCivil:[''],
      cVehicle:[''],
      anioVehicle:[''],
      weighVehicle:['']

    })
  }

  getFormCarta(): FormGroup {
    return this.formInvoice;
  }
  getAutotrasporte(): FormGroup {
    return this.autotransporte
  }
  getRemolques(): FormGroup {
    let { remolques } = this.formInvoice.value
    return remolques as FormGroup;
  }
  getseguros(): FormGroup {
    let { seguros } = this.formInvoice.value
    return seguros as FormGroup;
  }
  getUbicacionesFormArray(): FormArray {
    let { ubicaciones } = this.formInvoice.value
    return ubicaciones as FormArray;
  }
  getMercanciasFormArray(): FormArray {
    let { mercancias } = this.formInvoice.value
    return mercancias as FormArray;
  }
  getFigurasFormArray(): FormArray {
    let { figuras } = this.formInvoice.value
    return figuras as FormArray;
  }


}
