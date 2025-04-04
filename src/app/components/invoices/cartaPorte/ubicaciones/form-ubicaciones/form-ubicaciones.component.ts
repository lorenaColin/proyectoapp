import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/services/validators.service';
import { PATRON_RFC } from '../../../../../shared/utils/expressions';
import { ubicacionesService } from '../../../../services/ubicaciones.service';
import { ApiResponsepais, catpais, ubicacionInterface } from '../../../../interfaces/ubicaciones.interface';
import { AuthService } from '../../../../services/auth.service';
import { LISTADORFCSGENERICOS } from '../../../../../shared/utils/sat';
import Swal from 'sweetalert2';
import { debounceTime, max, Subject } from 'rxjs';

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
  showTooltip = false;
  private validatorsService = inject(ValidatorsService);
  private authService = inject(AuthService);
  private ubicaciones = inject(ubicacionesService)
  LISTADORFCSGENERICOS = LISTADORFCSGENERICOS;
  buttonTitle: string = 'Crear';
  idUbicacion = 0;
  isDomicilioChecked = false;
  localidades: any[] = [];
  colonias: any[] = [];
  estadoDescripcion: string = '';
  municipioDescripcion: string = '';
  private ubicacionesService = inject(ubicacionesService);
  // myForm! : FormGroup;
  @Input() myForm!: FormGroup;  // Recibe el formulario desde el padre



  ngOnChanges(): void {
    if (!this.myForm) {
      this.myForm = this.ubicacionesService.getFormUbicacion("");
    }
  
    if (this.ubicacionHijo) {
      this.idUbicacion = this.ubicacionHijo.id || 0;
      this.buttonTitle = this.idUbicacion !== 0 ? 'Actualizar' : 'Crear';
      this.isDomicilioChecked = !!this.ubicacionHijo.domicilio;
  
      this.myForm.patchValue({
        ...this.ubicacionHijo,
        domicilio: this.isDomicilioChecked, 
      });
      this.clavepaisDescription = '';
      if (this.ubicacionHijo && this.ubicacionHijo.id !== 0 && this.ubicacionHijo.pais)  {
        this.obtenerDescripcionPais(this.ubicacionHijo.pais);
      }
      if (this.ubicacionHijo.estado && this.ubicacionHijo.municipio && this.ubicacionHijo.pais === 'MEX') {
        const estado = this.colonias.find(colonia => colonia.valor === this.ubicacionHijo.estado);
        const municipio = this.localidades.find(localidad => localidad.valor === this.ubicacionHijo.municipio);
        this.estadoDescripcion = estado ? estado.descripcion : this.ubicacionHijo.estado;
        this.municipioDescripcion = municipio ? municipio.descripcion : this.ubicacionHijo.municipio;
      } else {
        this.estadoDescripcion = '';
        this.municipioDescripcion = '';
      }

    }
  
    this.onValueChanges();
  
  
    if (this.myForm.get('pais')) {
      this.myForm.get('pais')?.valueChanges.subscribe(pais => {
        console.log('Nuevo valor de país:', pais);
  
        this.isEstadoReadonly = pais === 'MEX';
  
        if (!pais || pais.trim() === '') {
          console.log('Limpiando los campos de ubicación...');
          this.myForm.patchValue({
            codigoPostal: '',
            estado: '',
            municipio: '',
            localidad: '',
            colonia: '',
            calle: '',
            numeroExterior: '',
            numeroInterior: '',
            referencia: ''
          }, { emitEvent: false });
  
          // console.log('Valores actuales del formulario:', this.myForm.value);
        }
        if (pais === 'MEX') {
          this.onCodigoPostalBlur(); // Llamada para obtener las descripciones de estado y municipio
        }
      });
    }
    
  }
  
  get currentUbicacion(): ubicacionInterface {
    const ubicacion = this.myForm.value as ubicacionInterface;
    console.log(ubicacion)
    return ubicacion;
  }

  obtenerDescripcionPais(clave: string): void {
    if (!clave) {
      this.clavepaisDescription = '';
      return;
    }
  
    this.ubicaciones.getAllPais(clave).subscribe({
      next: (response: ApiResponsepais) => {
        const paisEncontrado = response.data.find(p => p.c_pais.toString() === clave);
        if (paisEncontrado) {
          this.clavepaisDescription = paisEncontrado.descripcion;
          this.myForm.patchValue({ pais: clave });
        } else {
          this.clavepaisDescription = '';
        }
      },
      error: (err) => {
        console.error('Error al obtener la descripción del país:', err);
        this.clavepaisDescription = '';
      }
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.showLoader = true;
      const uuidCompany = this.authService.getUuid();
      console.log('UUID de la empresa:', uuidCompany);
      console.log(this.myForm.value);

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
          // this.resetUbicacion();
          this.showLoader = false;
        },
        error: (err) => {
          console.error('Error al enviar los datos:', err);
          this.showLoader = false;
        },
      });
    } else {
      console.log(this.myForm.value);
      this.myForm.markAllAsTouched();

      Object.keys(this.myForm.controls).forEach((controlName) => {
        const control = this.myForm.get(controlName);
        if (control?.invalid && control?.touched) {
          console.log(`Campo inválido: ${controlName}`, control.errors);
        }
      });
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
    this.myForm.patchValue({ domicilio: this.isDomicilioChecked });
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

  showResidenciaFiscal = false;  
  showNumRegIdTrib = false;
  listPais: catpais[] = [];
  filteredPais: catpais[] = [];
  selectedIndex: number = -1;
  isEstadoReadonly = false;
  buscar1 = new Subject<string>();
  buscar2 = new Subject<string>();
  ngOnInit(): void {
    this.buscar1.pipe(debounceTime(500)).subscribe((query: string) => {
      this.BuscarPais(query);
    });
  
    this.buscar2.pipe(debounceTime(500)).subscribe((query: string) => {
      this.BuscarPais2(query);
    });
  
    this.onValueChanges();
  
    
  }
  

  onValueChanges(): void {
    this.myForm.get('rfc')?.setValidators([Validators.minLength(12), Validators.required, Validators.pattern(PATRON_RFC)]);

    this.myForm.get('rfc')?.valueChanges.subscribe((rfcValue) => {

      if (rfcValue === 'XEXX010101000') {
        this.showResidenciaFiscal = true;
        this.showNumRegIdTrib = true;

        this.myForm.get('numRegIdTrib')?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(40)]);
        this.myForm.get('residenciaFiscal')?.setValidators([Validators.required]);

        this.myForm.get('numRegIdTrib')?.updateValueAndValidity({ emitEvent: false });
        this.myForm.get('residenciaFiscal')?.updateValueAndValidity({ emitEvent: false });
      } else {
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

 
  onInput(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Buscando pais:', query);
    this.buscar1.next(query);
  }
  private BuscarPais(query: string): void {
    const control = this.myForm.get('pais');
    if (!control) return;
    if (query.length === 0) {
      control.setErrors(null);

      if (control.hasValidator(Validators.required)) {
        control.setValidators([Validators.required]);
      }
      control.updateValueAndValidity();
      this.filteredPais = [];
      this.showLoader = false;
      return;
    }
    if (query.length < 2) {
      control.setErrors({ notFound: true });
      this.filteredPais = [];
      this.showLoader = false;
      return;
    }
    this.showLoader = true;
    this.ubicaciones.getAllPais(query).subscribe({
      next: (response: ApiResponsepais) => {
        console.log('Respuesta de la API:', response);
        this.filteredPais = response.data || [];
        console.log('Productos obtenidos:', this.filteredPais);

        const exactMatch = this.filteredPais.some(producto =>
          producto.c_pais.toString().toLowerCase() === query ||
          producto.descripcion.toLowerCase() === query
        );

        if (!exactMatch) {
          control.setErrors({ notFound: true });
        } else {
          control.setErrors(null);
        }

        this.showLoader = false;
      },
      error: (err) => {
        console.error('Error en la búsqueda de productos:', err);
        this.showLoader = false;
      }
    });
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

  listPais2: catpais[] = [];
  filteredPais2: catpais[] = [];

  
  onInput1(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Buscando pais:', query);
    this.buscar2.next(query);
  }
  private BuscarPais2(query: string): void {
    const control = this.myForm.get('residenciaFiscal');
    if (!control) return;
    if (query.length === 0) {
      control.setErrors(null);
      if (control.hasValidator(Validators.required)) {
        control.setValidators([Validators.required]);
      }
      control.updateValueAndValidity();
      this.filteredPais2 = [];
      this.showLoader = false;
      return;
    }
    if (query.length < 2) {
      control.setErrors({ notFound: true });
      this.filteredPais2 = [];
      this.showLoader = false;
      return;
    }
    this.showLoader = true;
    this.ubicaciones.getAllPais(query).subscribe({
      next: (response: ApiResponsepais) => {
        console.log('Respuesta de la API:', response);
        this.filteredPais2 = response.data.filter(pais => pais.c_pais !== 'MEX');
        console.log('Productos obtenidos sin MEX:', this.filteredPais2);
        const exactMatch = this.filteredPais2.some(pais =>
          pais.c_pais.toString().toLowerCase() === query ||
          pais.descripcion.toLowerCase() === query
        );
  
        if (!exactMatch) {
          control.setErrors({ notFound: true });
        } else {
          control.setErrors(null);
        }
  
        this.showLoader = false;
      },
      error: (err) => {
        console.error('Error en la búsqueda de productos:', err);
        this.showLoader = false;
      }
    });
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

  onKeyDown2(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      if (this.selectedIndex < this.filteredPais2.length - 1) {
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
        this.selectPais2(this.filteredPais2[this.selectedIndex]);
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside2(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#residenciaFiscal')) {
      this.filteredPais2 = [];
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
          this.localidades = [];
          this.colonias = [];
          data.colonias.forEach((element: string) => {
            let contenido = element.split("|");
            this.colonias.push({ "valor": contenido[0], "descripcion": contenido[1] })
          });
          data.localidades.forEach((element: string) => {
            let contenidol = element.split("|");
            this.localidades.push({ "valor": contenidol[0], "descripcion": contenidol[1] })
          });

          console.log(data.colonias)
          console.log(data.localidades)


          this.myForm.patchValue({
            estado: data.c_estado || '',
            municipio: data.cat_municipio || '',
            localidad: '',  
            colonia: '', 
          });
          this.estadoDescripcion = data.Nombreestado || '';
          this.municipioDescripcion = data.municipio || '';
        },

        error: (err) => {
          this.showLoader = false;
          Swal.fire('Error', err.error?.msg || 'No se pudo obtener la dirección.', 'error');
        },
      });
    }
  }
}
