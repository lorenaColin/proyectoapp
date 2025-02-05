import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/services/validators.service';
import { PATRON_RFC } from '../../../../../shared/utils/expressions';
import { ubicacionesService } from '../../../../services/ubicaciones.service';
import { ubicacionInterface } from '../../../../interfaces/ubicaciones.interface';
import { AuthService } from '../../../../services/auth.service';
import { LISTADORFCSGENERICOS } from '../../../../../shared/utils/sat';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-ubicaciones',
  templateUrl: './form-ubicaciones.component.html',
  styleUrl: './form-ubicaciones.component.scss'
})
export class FormUbicacionesComponent {
  @Input() ubicacionHijo!: ubicacionInterface;
  @Output() respuesta = new EventEmitter<ubicacionInterface>();
  paises: string[] = [];
  showLoader = false;
  private validatorsService = inject(ValidatorsService);
  private authService = inject(AuthService);
  private ubicaciones = inject(ubicacionesService)
  LISTADORFCSGENERICOS = LISTADORFCSGENERICOS;
  buttonTitle: string = 'Crear';
  idUbicacion = 0;
  isDomicilioChecked = false;
  localidades: string[] = []; 
  colonias: string[] = [];     

  private ubicacionesService = inject(ubicacionesService);
  // myForm! : FormGroup;
  @Input() myForm!: FormGroup;  // Recibe el formulario desde el padre


  ngOnChanges(): void {
    if (!this.myForm) {
      this.myForm = this.ubicacionesService.getFormUbicacion("");  // Si no existe, inicialízalo
    }
    console.log(this.ubicacionHijo);
    if (this.ubicacionHijo) {
      this.idUbicacion = this.ubicacionHijo.id || 0;
      this.buttonTitle = this.idUbicacion !== 0 ? 'Actualizar' : 'Crear';
        // this.isDomicilioChecked = !!this.ubicacionHijo.domicilio;
      this.myForm.patchValue({
        ...this.ubicacionHijo,
      });
      
    }
  }


  get currentUbicacion(): ubicacionInterface {
    const ubicacion = this.myForm.value as ubicacionInterface;
    console.log(ubicacion)
    return ubicacion;
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

      const action = this.idUbicacion !== 0
        ? this.ubicaciones.updateubicacion(this.idUbicacion, formData)
        : this.ubicaciones.createUbicacion(formData);

      action.subscribe({
        next: (response) => {
          this.respuesta.emit(response.data);
          this.resetUbicacion();
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

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }
 

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }
  closeModal(): void {
    this.resetUbicacion();
    this.idUbicacion = 0;
    this.buttonTitle = 'Crear';

  }
  toggleDomicilio() {
    this.isDomicilioChecked = !this.isDomicilioChecked;
    if (this.isDomicilioChecked) {
      this.myForm.get('pais')?.setValidators([Validators.required]);
      this.myForm.get('codigoPostal')?.setValidators([Validators.required]);
      this.myForm.get('estado')?.setValidators([Validators.required]);
    } else {
      this.myForm.get('pais')?.clearValidators();
      this.myForm.get('codigoPostal')?.clearValidators();
      this.myForm.get('estado')?.clearValidators();
    }
    this.myForm.get('pais')?.updateValueAndValidity();
    this.myForm.get('codigoPostal')?.updateValueAndValidity();
    this.myForm.get('estado')?.updateValueAndValidity();
    if (!this.isDomicilioChecked) {
      this.myForm.patchValue({
        pais: '',
        codigoPostal: '',
        estado: '',
        municipio: '',
        localidad: '',
        colonia: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        referencia: '',
      });
    }
  }

  resetUbicacion(): void {
    this.myForm.reset({
      rfc: '',
      idUbicacion: '',
      NombreRemitenteDestinatario: '',
      numRegIdTrib: '',
      residenciaFiscal: '',
      domicilio: '',
      pais: '',
      codigoPostal: '',
      estado: '',
      municipio: '',
      localidad: '',
      colonia: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      referencia: '',
    });
  }
  ngOnInit(): void {
 
    this.ubicaciones.getPaises().subscribe({
      next: (data: string[]) => {
        this.paises = data; 
      },
      error: (err) => {
      },
    });
    this.myForm.get('pais')?.valueChanges.subscribe((pais) => {
      if (pais === 'México') {
        this.myForm.get('estado')?.disable();
      } else {
        this.myForm.get('estado')?.enable();
      }
    });

    this.myForm.get('rfc')?.valueChanges.subscribe((rfcValue: string) => {
      if (rfcValue === 'XEXX010101000') {
        this.myForm.get('numRegIdTrib')?.setValidators([Validators.required, Validators.maxLength(40), Validators.minLength(6)]);
        this.myForm.get('residenciaFiscal')?.setValidators([Validators.required]);
      } else {
        this.myForm.get('numRegIdTrib')?.clearValidators();
        this.myForm.get('residenciaFiscal')?.clearValidators();
        this.myForm.patchValue({
          numRegIdTrib: '',
          residenciaFiscal: '',
        });
      }
      this.myForm.get('numRegIdTrib')?.updateValueAndValidity();
      this.myForm.get('residenciaFiscal')?.updateValueAndValidity();
    });
  }


  onCodigoPostalBlur(): void {
    const codigoPostal = this.myForm.get('codigoPostal')?.value;
    if (codigoPostal) {
      this.showLoader = true;
      this.ubicacionesService.getDireccion(codigoPostal).subscribe({
        next: (data) => {
          this.showLoader = false;
          this.localidades = data.localidades || [];
          this.colonias = data.colonias || [];

          this.myForm.patchValue({
            estado: data.estado || '',
            municipio: data.municipio || '',
            localidad: this.localidades[0] || '',
            colonia: this.colonias[0] || '',
          });
        },
        error: (err) => {
          this.showLoader = false;
          Swal.fire('Error', err.error?.msg || 'No se pudo obtener la dirección.', 'error');
        },
      });
    }
  }
}
