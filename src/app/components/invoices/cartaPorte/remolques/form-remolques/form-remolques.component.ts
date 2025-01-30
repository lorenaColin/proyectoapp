import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/services/validators.service';
import { remolquesInterface } from '../../../../interfaces/remolques.interface';
import { AuthService } from '../../../../services/auth.service';
import { remolquesService } from '../../../../services/remolques.service';
import { PATRON_PLACA } from '../../../../../shared/utils/expressions';

@Component({
  selector: 'app-form-remolques',
  templateUrl: './form-remolques.component.html',
  styleUrl: './form-remolques.component.scss'
})
export class FormRemolquesComponent {
  @Input() remolquesHijo!: remolquesInterface;
  @Output() respuesta = new EventEmitter<remolquesInterface>();
  private authService = inject(AuthService);
  private remolques = inject(remolquesService)
  buttonTitle: string = 'Crear';
  idRemolques = 0;
  // remolquess: string[] = [];

  private fb = inject(FormBuilder);
  paises: string[] = [];
  showLoader = false;
  private validatorsService = inject(ValidatorsService);
  ngOnChanges(): void {
    console.log(this.remolquesHijo);
    if (this.remolquesHijo) {
      this.idRemolques = this.remolquesHijo.id || 0;
      this.buttonTitle = this.idRemolques !== 0 ? 'Actualizar' : 'Crear';
      // this.isDomicilioChecked = !!this.ubicacionHijo.domicilio;
      this.myForm.patchValue({
        ...this.remolquesHijo,
      });

    }
  }


  myForm: FormGroup = this.fb.group({
    SubTipoRem: ['', [Validators.required]],
    placa: ['', [Validators.required,Validators.pattern(PATRON_PLACA), Validators.maxLength(7)]],
  });

  get currentRemolques(): remolquesInterface {
    const remolques = this.myForm.value as remolquesInterface;
    console.log(remolques)
    return remolques;
  }
  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }
  closeModal(): void {
    this.resetProduct();
    this.idRemolques = 0;
    this.buttonTitle = 'Crear';
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
      console.log('Formulario enviado:', formData);
      const action = this.idRemolques !== 0
        ? this.remolques.updateRemolques(this.idRemolques, formData)
        : this.remolques.createRemolques(formData);

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
  resetProduct(): void {
    this.myForm.reset({
      tipoRemolque: "",
      placavehicular: "",


    })
  }

  remolquess: { Clave: string; descripcion: string }[] = [];

// ngOnInit(): void {
//   this.remolques.getremolques().subscribe({
//     next: (data) => {
//       this.remolquess = data;
//     },
//     error: (err) => {
//       console.error('Error al obtener remolques:', err);
//     },
//   });
// }
ngOnInit(): void {
  this.remolques.getremolques().subscribe({
    next: (data) => {
      console.log('Datos recibidos:', data); // 🔍 Verifica que los datos lleguen correctamente
      this.remolquess = data; 
      console.log(this.remolquess)
    },
    error: (err) => {
      console.error('Error al obtener remolques:', err);
    },
  });
}
}




