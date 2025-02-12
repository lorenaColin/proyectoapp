import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/services/validators.service';
import { figurasService } from '../../../../services/figuras.service';
import Swal from 'sweetalert2';
import { FigurasInterface } from '../../../../interfaces/figuras.interface';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-form-figuras',
  templateUrl: './form-figuras.component.html',
  styleUrl: './form-figuras.component.scss'
})
export class FormFigurasComponent {
  @Input() figuraHijo!: FigurasInterface;
  @Output() respuesta = new EventEmitter<FigurasInterface>();
  figura: string[] = [];
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  paises: string[] = [];
  showLoader = false;
  private figuras = inject(figurasService)
  buttonTitle: string = 'Crear';
  idFiguras = 0;

  isOperadorSelected: boolean = false;

  onTipoFiguraChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.isOperadorSelected = selectedValue === 'Operador';

    if (this.isOperadorSelected) {
      this.myForm.get('numLicencia')?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(16)]);
    } else {
      this.myForm.get('numLicencia')?.clearValidators();
    }

    // Actualizar la validez del campo 'numLicencia'
    this.myForm.get('numLicencia')?.updateValueAndValidity();
  }
  ngOnChanges(): void {
    if (this.figuraHijo) {
      this.idFiguras = this.figuraHijo.id || 0;
      this.buttonTitle = this.idFiguras !== 0 ? 'Actualizar' : 'Crear';
      this.myForm.patchValue({
        ...this.figuraHijo,
      });
    } else {
      this.myForm.reset();
    }
  }
  get currentUbicacion(): FigurasInterface {
    const figurass = this.myForm.value as FigurasInterface;
    console.log(figurass)
    return figurass;
  }

  myForm: FormGroup = this.fb.group({
    tipoFigura: ['', [Validators.required]],
    rfcFigura: ['', [Validators.required]],
    numLicencia: ['', [ Validators.minLength(6), Validators.maxLength(16),]],
    nombreFigura: ['', [Validators.minLength(1), Validators.maxLength(255),]],
    numRegIdTribFigura: ['', [Validators.minLength(6), Validators.maxLength(40)]],
    residenciaFiscalFigura: ['', []],
    domicilio: ['', []],
    pais: ['', [Validators.required]],
    codigoPostal: ['', [Validators.required]],
    estado: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(1)]],
    municipio: ['', []],
    localidad: ['', []],
    colonia: ['', []],
    calle: ['', []],
    numeroExterior: ['', []],
    numeroInterior: ['', []],
    referencia: ['', []],
  });


  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }
  closeModal(): void {
    this.resetFiguras();
    this.idFiguras = 0;
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

      const action = this.idFiguras !== 0
        ? this.figuras.updatefiguras(this.idFiguras, formData)
        : this.figuras.createfiguras(formData);

      action.subscribe({
        next: (response) => {
          this.respuesta.emit(response.data);
          this.resetFiguras();
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
  resetFiguras(): void {
    this.myForm.reset({

      tipoFigura: "",
      rfcFigura: "",
      numLicencia: "",
      nombreFigura: "",
      numRegIdTribFigura: "",
      residenciaFiscalFigura: '',
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
    })
  }

  isDomicilioChecked = false;
  localidades: string[] = [];
  colonias: string[] = [];
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


  ngOnInit(): void {

    this.figuras.getPaises().subscribe({
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
        this.myForm.get('numRegIdTribFigura')?.setValidators([Validators.required, Validators.maxLength(40), Validators.minLength(6)]);
        this.myForm.get('residenciaFiscalFigura')?.setValidators([Validators.required]);
      } else {
        this.myForm.get('numRegIdTribFigura')?.clearValidators();
        this.myForm.get('residenciaFiscalFigura')?.clearValidators();
        this.myForm.patchValue({
          numRegIdTrib: '',
          residenciaFiscal: '',
        });
      }
      this.myForm.get('numRegIdTribFigura')?.updateValueAndValidity();
      this.myForm.get('residenciaFiscalFigura')?.updateValueAndValidity();
    });
  }
  onCodigoPostalBlur(): void {
    const codigoPostal = this.myForm.get('codigoPostal')?.value;
    if (codigoPostal) {
      this.showLoader = true;
      this.figuras.getDireccion(codigoPostal).subscribe({
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
