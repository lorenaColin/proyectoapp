import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/services/validators.service';
import { PATRON_RFC } from '../../../../../shared/utils/expressions';
import { ubicacionesService } from '../../../../services/ubicaciones.service';
import { ApiResponsepais, catpais, ubicacionInterface } from '../../../../interfaces/ubicaciones.interface';
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
      console.log(this.buttonTitle)
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
      this.myForm.get('estado')?.setValidators([Validators.required]);
      this.myForm.get('codigoPostal')?.setValidators([Validators.required]);



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
  
  showResidenciaFiscal = false;  // Inicializamos en false
  showNumRegIdTrib = false;  
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
  
  onValueChanges(): void {
   console.log("entrando a onvalue")
    this.myForm.get('rfc')?.setValidators([Validators.required]);
  
    this.myForm.get('rfc')?.valueChanges.subscribe((rfcValue) => {
      console.log('RFC ingresado:', rfcValue); 
  
      if (rfcValue === 'XEXX010101000') {
        console.log('RFC especial detectado, mostrando campos');
        this.showResidenciaFiscal = true;
        this.showNumRegIdTrib = true;
  
        this.myForm.get('numRegIdTrib')?.setValidators([Validators.required]);
        this.myForm.get('residenciaFiscal')?.setValidators([Validators.required]);
  
        this.myForm.get('numRegIdTrib')?.updateValueAndValidity({ emitEvent: false });
        this.myForm.get('residenciaFiscal')?.updateValueAndValidity({ emitEvent: false });
      } else {
        console.log('RFC diferente, ocultando campos');
        this.showResidenciaFiscal = false;
        this.showNumRegIdTrib = false;
  
        this.myForm.get('numRegIdTrib')?.clearValidators();
        this.myForm.get('residenciaFiscal')?.clearValidators();
  
        this.myForm.get('numRegIdTrib')?.setValue('');
        this.myForm.get('residenciaFiscal')?.setValue('');
  
        this.myForm.get('numRegIdTrib')?.updateValueAndValidity({ emitEvent: false });
        this.myForm.get('residenciaFiscal')?.updateValueAndValidity({ emitEvent: false });
      }
    });
  }
  
  
  
  isRFCValido(rfc: string): boolean {
    const regex = new RegExp(PATRON_RFC);
    return regex.test(rfc);
  }

  loadPais(): void {
    this.ubicaciones.getAllPais().subscribe({
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
  // -------------------------------------
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
              this.myForm.get('residenciaFiscal')?.setErrors({ notFound: true });
            } else {
              this.myForm.get('residenciaFiscal')?.setErrors(null);
            }
          }
          this.showLoader = false;
        }, 1000);
      } else {
        this.filteredPais = [];
        this.showLoader = false;
        this.myForm.get('residenciaFiscal')?.setErrors(null);
      }
    }
  
  
  
    clavepaisDescription2: string = '';
  
  
    selectPais2(Pais: catpais): void {
      this.clavepaisDescription2 = Pais.descripcion;
      this.myForm.get('residenciaFiscal')?.setValue(Pais.c_pais.toString());
      this.filteredPais = [];
      this.selectedIndex = -1;
  
      this.myForm.get('residenciaFiscal')?.setErrors(null);
      const inputElement = document.getElementById('residenciaFiscalUbi') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = this.clavepaisDescription2;
      }
    }
  
  
  
    @HostListener('document:click', ['$event'])
    onClickOutside2(event: MouseEvent): void {
      const targetElement = event.target as HTMLElement;
      if (!targetElement.closest('#residenciaFiscal')) {
        this.filteredPais = [];
      }
    }
    onCodigoPostalBlur(): void {
      const codigoPostal = this.myForm.get('codigoPostal')?.value;
      const pais = this.myForm.get('pais')?.value;
  
      if (pais === 'MEX' && codigoPostal) {
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
