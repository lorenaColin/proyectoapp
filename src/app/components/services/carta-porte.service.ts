import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CartaPorteService {
  formInvoice: FormGroup;
  // autotransporte:FormGroup
  constructor(private fb: FormBuilder) {
    this.formInvoice = this.fb.group({
      selectIstmo: [''],
      uPoloOrigen: [''],
      uPoloDestino: [''],
      serieFolio: [''],
      ubicaciones: this.fb.array([

      ]),
      mercancias: this.fb.array([]),
      PesoBrutoTotal: [''],
      UnidadPeso: [''],
      NumTotalMercancias: [''],
      remolques: this.fb.group({
        sAmbientr: [''],
        placaRem: [''],
        sAmbient1: [''],
        placaRem1: [''],
      }),
      seguros: this.fb.group({
        sAmbients: [''],
        sCarge: [''],
        pSeguro: [''],
      }),
      figuras: this.fb.array([]),
      autotransporte: this.fb.group({
        placa: [''],
        PermSCT2: [''],
        NumPermisoSCT: [''],
        aCivil: [''],
        cVehicle: [''],
        anioVehicle: [''],
        weighVehicle: ['']

      })
    });

  }

  getFormCarta(): FormGroup {
    return this.formInvoice;
  }

  getAutotransporteForm(): FormGroup {
    return this.formInvoice.get('autotransporte') as FormGroup;
  }
  getRemolques(): FormGroup {
    return this.formInvoice.get('remolques') as FormGroup;

  }
  getseguros(): FormGroup {
    return this.formInvoice.get('seguros') as FormGroup;
  }
  getUbicacionesFormArray(): FormArray {
    return this.formInvoice.get('ubicaciones') as FormArray;

  }
  getMercanciasFormArray(): FormArray {
    return this.formInvoice.get('mercancias') as FormArray;

  }


  getFigurasFormArray(): FormArray {
    return this.formInvoice.get('figuras') as FormArray;
  }


}
