import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/services/validators.service';
import { figurasService } from '../../../../services/figuras.service';
import Swal from 'sweetalert2';
import { ApiResponsepais, catpais, FigurasInterface, FigurasResponseInterface } from '../../../../interfaces/figuras.interface';
import { AuthService } from '../../../../services/auth.service';
import { PATRON_RFC } from '../../../../../shared/utils/expressions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-figuras',
  templateUrl: './form-figuras.component.html',
  styleUrl: './form-figuras.component.scss'
})
export class FormFigurasComponent {
  @Input() figuraHijo!: FigurasInterface;
  @Output() respuesta = new EventEmitter<FigurasResponseInterface>();
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
  // ngOnChanges(): void {
  //   if (this.figuraHijo) {
  //     this.idFiguras = this.figuraHijo.id || 0;
  //     this.buttonTitle = this.idFiguras !== 0 ? 'Actualizar' : 'Crear';
  //     this.myForm.patchValue({
  //       ...this.figuraHijo,
  //     });
  //   } else {
  //     this.myForm.reset();
  //   }
  // }
  ngOnChanges(): void {
    this.idFiguras = this.figuraHijo.id || 0;
    this.myForm.patchValue(this.figuraHijo);
    this.idFiguras != 0 ? (this.buttonTitle = 'Actualizar') : 'Guardar';
  }
 
  get currentUbicacion(): FigurasInterface {
    const figurass = this.myForm.value as FigurasInterface;
    console.log(figurass)
    return figurass;
  }

  myForm: FormGroup = this.fb.group({
    tipoFigura: ['', [Validators.required]],
    rfcFigura: ['', [Validators.pattern(PATRON_RFC)]],
    numLicencia: ['', [Validators.minLength(6), Validators.maxLength(16),]],
    nombreFigura: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255),]],
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
    private subscription: Subscription = new Subscription();
  
  onSubmit(): void {
    this.showLoader = true;
    const uuidCompany = this.authService.getUuid();
    console.log('UUID de la empresa:', uuidCompany);
    if (this.myForm.invalid) {
      this.showLoader = false;
      this.myForm.markAllAsTouched();
      console.log('Formulario inválido. Por favor corrija los errores.');
      return;
    }

    const formData = {
      ...this.myForm.value,
      uuid_company: uuidCompany || '',
    };
    
    console.log('Datos a enviar:', formData);

    const submitCustomer = this.idFiguras
      ? this.figuras.updatefiguras(this.idFiguras, formData)
      : this.figuras.createInsurance(formData);
    this.subscription.add(
      submitCustomer.subscribe(
        (response) => {
          this.showLoader = false;
          this.respuesta.emit(response);
          console.log('Respuesta del servidor:', response);
          this.myForm.reset();
          this.closeModal();
        },
        (error) => {
          console.error('Error al enviar los datos del seguro', error);
          this.showLoader = false;
        }
      )
    );
  }
  // onSubmit(): void {
  //   console.log("entrando al formulario")
  //   if (this.myForm.valid) {
  //     this.showLoader = true;
  //     const uuidCompany = this.authService.getUuid();
  //     console.log('UUID de la empresa:', uuidCompany);

  //     const formData = {
  //       ...this.myForm.value,
  //       uuid_company: uuidCompany || '',
  //     };

  //     const action = this.idFiguras !== 0
  //       ? this.figuras.updatefiguras(this.idFiguras, formData)
  //       : this.figuras.createfiguras(formData);

  //     action.subscribe({
  //       next: (response) => {
  //         this.respuesta.emit(response.data);
  //         this.resetFiguras();
  //         this.showLoader = false;
  //       },
     

  //       error: (err) => {
  //         console.error('Error al enviar los datos:', err);
  //         this.showLoader = false;
  //       },
  //     });
  //   } else {
  //     this.myForm.markAllAsTouched();
  //   }
  // }
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




  listPais: catpais[] = [];
  filteredPais: catpais[] = [];
  selectedIndex: number = -1;
  ngOnInit(): void {
    this.loadPais();
    this.onValueChanges();
    this.myForm.get('pais')?.valueChanges.subscribe((pais) => {
      if (pais === 'MEX') {
        this.myForm.get('estado')?.disable();
      } else {
        this.myForm.get('estado')?.enable();
      }
    });
  }
  showRfcFigura = true;
showNumRegIdTribFigura = true;
showResidenciaFiscalFigura = true;

onValueChanges(): void {
  this.myForm.get('rfcFigura')?.setValidators([Validators.required]);
  this.myForm.get('numRegIdTribFigura')?.setValidators([Validators.required]);

  this.myForm.get('rfcFigura')?.valueChanges.subscribe((rfcValue) => {
    setTimeout(() => {
      if (rfcValue) {
        this.showNumRegIdTribFigura = false;
        this.showResidenciaFiscalFigura = false;
        this.myForm.get('numRegIdTribFigura')?.clearValidators();
        this.myForm.get('numRegIdTribFigura')?.updateValueAndValidity({ emitEvent: false });
      } else {
        this.showNumRegIdTribFigura = true;
        this.showResidenciaFiscalFigura = true;
        this.myForm.get('numRegIdTribFigura')?.setValidators([Validators.required]);
        this.myForm.get('numRegIdTribFigura')?.updateValueAndValidity({ emitEvent: false });
      }
    });
  });

  this.myForm.get('numRegIdTribFigura')?.valueChanges.subscribe((numRegId) => {
    setTimeout(() => {
      if (numRegId) {
        this.showRfcFigura = false;
        this.myForm.get('rfcFigura')?.clearValidators();
        this.myForm.get('rfcFigura')?.updateValueAndValidity({ emitEvent: false });
      } else {
        this.showRfcFigura = true;
        this.myForm.get('rfcFigura')?.setValidators([Validators.required]);
        this.myForm.get('rfcFigura')?.updateValueAndValidity({ emitEvent: false });
      }
    });
  });
}



  isRFCValido(rfc: string): boolean {
    const regex = new RegExp(PATRON_RFC);
    return regex.test(rfc);
  }

  loadPais(): void {
    this.figuras.getAllPais().subscribe({
      next: (response: ApiResponsepais) => {
        console.log('Datos recibidos desde el servicio:', response);
        if (Array.isArray(response.data)) {
          this.listPais = response.data;
          console.log('listPais:', this.listPais);
        } else {
          console.error('La respuesta no contiene un array en "data":', response.data);
          this.listPais = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
        this.showLoader = false;
      }
    });
  }

  onInput(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Texto ingresado:', query);

    if (query.length >= 2) {
      this.showLoader = true;
      setTimeout(() => {
        if (Array.isArray(this.listPais)) {
          this.filteredPais = this.listPais.filter((Pais) => {
            const clave = Pais.c_pais.toString().toLowerCase();
            const descripcion = Pais.descripcion.toLowerCase();
            return clave.includes(query) || descripcion.includes(query);
          });
          console.log('Paiss filtrados:', this.filteredPais);

          const exactMatch = this.listPais.some(product =>
            product.c_pais.toString().toLowerCase() === query ||
            product.descripcion.toLowerCase() === query
          );

          if (!exactMatch) {
            this.myForm.get('pais')?.setErrors({ notFound: true });
          } else {
            this.myForm.get('pais')?.setErrors(null);
          }
        }
        this.showLoader = false;
      }, 1000);
    } else {
      this.filteredPais = [];
      this.showLoader = false;
      this.myForm.get('pais')?.setErrors(null);
    }
  }



  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      if (this.selectedIndex < this.filteredPais.length - 1) {
        this.selectedIndex++;
      }
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      event.preventDefault();
    } else if (event.key === 'Enter') {
      if (this.selectedIndex >= 0) {
        this.selectPais(this.filteredPais[this.selectedIndex]);
        this.selectPais2(this.filteredPais[this.selectedIndex]);



      }
    }
  }
  clavepaisDescription: string = '';


  selectPais(Pais: catpais): void {
    this.clavepaisDescription = Pais.descripcion;
    this.myForm.get('pais')?.setValue(Pais.c_pais.toString());
    this.filteredPais = [];
    this.selectedIndex = -1;

    this.myForm.get('pais')?.setErrors(null);
    const inputElement = document.getElementById('product_keys') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = this.clavepaisDescription;
    }
  }



  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#product_key')) {
      this.filteredPais = [];
    }
  }
  // ---------------------------------------------------------
  onInput1(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Texto ingresado:', query);

    if (query.length >= 2) {
      this.showLoader = true;
      setTimeout(() => {
        if (Array.isArray(this.listPais)) {
          this.filteredPais = this.listPais.filter((Pais) => {
            const clave = Pais.c_pais.toString().toLowerCase();
            const descripcion = Pais.descripcion.toLowerCase();
            return clave.includes(query) || descripcion.includes(query);
          });
          console.log('Paiss filtrados:', this.filteredPais);

          const exactMatch = this.listPais.some(product =>
            product.c_pais.toString().toLowerCase() === query ||
            product.descripcion.toLowerCase() === query
          );

          if (!exactMatch) {
            this.myForm.get('residenciaFiscalFigura')?.setErrors({ notFound: true });
          } else {
            this.myForm.get('residenciaFiscalFigura')?.setErrors(null);
          }
        }
        this.showLoader = false;
      }, 1000);
    } else {
      this.filteredPais = [];
      this.showLoader = false;
      this.myForm.get('residenciaFiscalFigura')?.setErrors(null);
    }
  }



  clavepaisDescription2: string = '';


  selectPais2(Pais: catpais): void {
    this.clavepaisDescription2 = Pais.descripcion;
    this.myForm.get('residenciaFiscalFigura')?.setValue(Pais.c_pais.toString());
    this.filteredPais = [];
    this.selectedIndex = -1;

    this.myForm.get('residenciaFiscalFigura')?.setErrors(null);
    const inputElement = document.getElementById('residenciaFiscalFiguras') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = this.clavepaisDescription2;
    }
  }



  @HostListener('document:click', ['$event'])
  onClickOutside2(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#residenciaFiscalFigura')) {
      this.filteredPais = [];
    }
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
