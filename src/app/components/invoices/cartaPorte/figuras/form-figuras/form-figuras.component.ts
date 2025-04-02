import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/services/validators.service';
import { figurasService } from '../../../../services/figuras.service';
import Swal from 'sweetalert2';
import { ApiResponsepais, catpais, FigurasInterface, FigurasResponseInterface } from '../../../../interfaces/figuras.interface';
import { AuthService } from '../../../../services/auth.service';
import { PATRON_RFC } from '../../../../../shared/utils/expressions';
import { debounceTime, Subject, Subscription } from 'rxjs';

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
  showTooltip = false;
  isOperadorSelected: boolean = false;

  onTipoFiguraChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.isOperadorSelected = selectedValue === 'Operador';

    if (this.isOperadorSelected) {
      this.myForm.get('numLicencia')?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(16)]);
    } else {
      this.myForm.get('numLicencia')?.clearValidators();
    }

    this.myForm.get('numLicencia')?.updateValueAndValidity();
  }

  ngOnChanges(): void {
    this.idFiguras = this.figuraHijo.id || 0;

    this.myForm.patchValue(this.figuraHijo);
    this.isDomicilioChecked = Boolean(this.figuraHijo.domicilio);
    this.myForm.patchValue({ domicilio: this.isDomicilioChecked });
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
    domicilio: [false],
    pais: ['', []],
    codigoPostal: ['', []],
    estado: ['', [Validators.maxLength(30), Validators.minLength(1)]],
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
          // this.myForm.reset();
          // this.closeModal();
        },
        (error) => {
          console.error('Error al enviar los datos del seguro', error);
          this.showLoader = false;
        }
      )
    );
  }

  resetFiguras(): void {
    this.myForm.reset({

      tipoFigura: "",
      rfcFigura: "",
      numLicencia: "",
      nombreFigura: "",
      numRegIdTribFigura: "",
      residenciaFiscalFigura: '',
      domicilio: false,
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
  localidades: any[] = [];
  colonias: any[] = [];
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



  listPais: catpais[] = [];
  filteredPais: catpais[] = [];
  selectedIndex: number = -1;
  isEstadoReadonly: boolean = false;
  buscar1 = new Subject<string>();
  buscar2 = new Subject<string>();
  ngOnInit(): void {

    this.buscar1.pipe(
      debounceTime(500),
    ).subscribe((query: string) => {
      this.BuscarPais(query);
    });
    this.buscar2.pipe(
      debounceTime(500),
    ).subscribe((query: string) => {
      this.BuscarPais2(query);
    });
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

        }
      });
    }

  }


  showRfcFigura = true;
  showNumRegIdTribFigura = true;
  showResidenciaFiscalFigura = true;

  onValueChanges(): void {
    this.myForm.get('rfcFigura')?.setValidators([Validators.minLength(12), Validators.maxLength(13), Validators.pattern(PATRON_RFC), Validators.required]);


    this.myForm.get('numRegIdTribFigura')?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(40)]);

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
    this.figuras.getAllPais(query).subscribe({
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
  // ---------------------------------------------------------
  listPais2: catpais[] = [];
  filteredPais2: catpais[] = [];

  onInput1(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    console.log('Buscando pais:', query);
    this.buscar2.next(query);
  }
  private BuscarPais2(query: string): void {
    const control = this.myForm.get('residenciaFiscalFigura');
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
    this.figuras.getAllPais(query).subscribe({
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
    this.myForm.get('residenciaFiscalFigura')?.setValue(Pais.c_pais.toString());
    this.filteredPais2 = [];
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
  estadoDescripcion: string = '';
  municipioDescripcion: string = '';
  onCodigoPostalBlur(): void {
    const codigoPostal = this.myForm.get('codigoPostal')?.value;
    const pais = this.myForm.get('pais')?.value;

    if (pais === 'MEX' && codigoPostal) {
      this.showLoader = true;
      this.figuras.getDireccion(codigoPostal).subscribe({
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
          this.myForm.patchValue({
            estado: data.c_estado || '',
            municipio: data.cat_municipio || '',
            localidad: '',
            colonia: '',
          });
          console.log(data.colonias)
          console.log(data.localidades)
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
