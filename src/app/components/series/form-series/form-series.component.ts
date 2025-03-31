import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { AuthService } from '../../services/auth.service';
import { SeriesService } from '../../services/serie.service';
import { SerietInterface } from '../../interfaces/series.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-series',
  templateUrl: './form-series.component.html',
  styleUrl: './form-series.component.scss'
})

export class FormSeriesComponent {
  @Input() productoHijo!: SerietInterface;
  @Output() respuesta = new EventEmitter<SerietInterface>();
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private authService = inject(AuthService);
  private series = inject(SeriesService)
  showLoader = false;
  buttonTitle: string = 'Crear';
  idSerie = 0;
  ngOnChanges(): void {
    console.log(this.productoHijo);  
    if (this.productoHijo) {
      this.idSerie = this.productoHijo.id || 0;  
      console.log(this.idSerie)
      this.buttonTitle = this.idSerie !== 0 ? 'Actualizar' : 'Crear';  
      const statusValue = this.idSerie !== 0 ? this.productoHijo.status : true;
      this.myForm.patchValue({
        ...this.productoHijo,  
        status: this.productoHijo.status ?? true,
          
      });
  
      const tipos = this.productoHijo.tipoComprobante ? this.productoHijo.tipoComprobante.split(',') : [];
      this.myForm.get('tipoComprobante')?.setValue(tipos); 
  
    } else {
      this.myForm.reset({ status: true }); 
    
    }
  }
  myForm: FormGroup = this.fb.group({
    serie: ['', [Validators.required, Validators.maxLength(25)]],
    folio: ['', [Validators.required, Validators.maxLength(5) ,Validators.pattern("^[0-9]{1,5}$")]],
    tipoComprobante: ['', [Validators.required, Validators.maxLength(40)]],
    status: [true],
  });
  get currentSerie(): SerietInterface {
    const serie = this.myForm.value as SerietInterface;
    console.log(serie)
    return serie;
  }
  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }
  closeModal(): void {
    this.formSerieReset();
    this.idSerie = 0;
    this.buttonTitle = 'Crear';

  }
  formSerieReset():void{
    this.myForm.reset({
      serie:"",
      folio:"",
      tipoComprobante:"",
      status:true
    })
  }

  // ngOnChanges(): void {
  //   console.log(this.productoHijo);
  //   this.idSerie = this.productoHijo.id || 0;
  //   this .myForm.patchValue(this.productoHijo);
  //   const tipos = this.productoHijo.tipoComprobante ? this.productoHijo.tipoComprobante.split(',') : [];
  //   this.myForm.get('tipoComprobante')?.setValue(tipos);
  //   this.buttonTitle = this.idSerie !== 0 ? 'Actualizar' : 'Crear';

  // }

  
  


  
  onSubmit(): void {
    if (this.myForm.valid) {
      this.showLoader = true;
      const tipoComprobante = this.myForm.value.tipoComprobante?.join(',');
  
   
      const uuidCompany = this.authService.getUuid();
      console.log('UUID de la empresa:', uuidCompany); 
  
      const formData = {
        ...this.myForm.value,
        uuid_company: uuidCompany || '', 
        tipoComprobante: tipoComprobante,
      };
      console.log('Formulario enviado:', formData);
  
      const action = this.idSerie !== 0
        ? this.series.updateSeries(this.idSerie, formData)
        : this.series.createSeries(formData);
  
      action.subscribe({
        next: (response) => {
          this.respuesta.emit(response.data);
          // this.formSerieReset();
          this.showLoader = false;
        },
        error: (err) => {
          console.error('Error al enviar los datos:', err);
          this.showLoader = false;
        },
      });
    }else {
      this.myForm.markAllAsTouched(); 
    }
  }
  
  
  
  


    templates = [
      {
        id: 1,
        name: 'Ingreso',
        value: 'p-1'
      },
      {
        id: 2,
        name: 'Egreso',
        value: 'p-2'
      },
      {
        id: 3,
        name: 'Traslado',
        value: 'p-3'
      },
      {
        id: 4,
        name: 'Pago',
        value: 'p-4'
      },
      {
        id: 5,
        name: 'Nomina',

        value: 'p-5'
      },

    ];
    selectedTemplate = this.templates[1].name;
    simpleItems2: any = [];
    tipoComprobante = ['Andrew'];
    Comprobante = [
      { id: 1, name: 'Ingreso' },
      { id: 2, name: 'Egreso' },
      { id: 3, name: 'Traslado' },
      { id: 4, name: 'Pago' },
      { id: 5, name: 'Nomina' },

    ];
    validateNumberInput(event: KeyboardEvent) {
      const input = event.target as HTMLInputElement;
      if (!/^\d$/.test(event.key) || input.value.length >= 5) {
        event.preventDefault();
      }
    }
    
  }
