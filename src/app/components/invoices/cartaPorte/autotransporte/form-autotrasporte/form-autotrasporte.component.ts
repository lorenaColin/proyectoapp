import {
  DECIMALES,
  PATRON_ANIO,
  PATRON_PLACAVM,
} from './../../../../../shared/utils/expressions';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/services/validators.service';
import { AutotransportService } from '../../../../services/autotransport.service';
import {
  AutotransportInterface,
  AutotransportResponseInterface,
} from '../../../../interfaces/autotransport.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-autotrasporte',
  templateUrl: './form-autotrasporte.component.html',
  styleUrl: './form-autotrasporte.component.scss',
})
export class FormAutotrasporteComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private autotransportService = inject(AutotransportService);
  buttonTitle: string = 'Crear';
  private subscription: Subscription = new Subscription();
  @Input() productoHijo!: AutotransportInterface;
  @Output() respuesta = new EventEmitter<AutotransportResponseInterface>();
  clientes: AutotransportInterface[] = [];
  idAutotransport = 0;
  showLoader = false;
  showTooltip = false;
  showTooltip1 = false;
  showTooltip2 = false;




  configVehicularList: any[] = [];
  permisosList: any[] = [];
  constructor() {
    this.loadConfigVehicular();
    this.loadPermisos();
  }

  ngOnChanges(): void {
    this.idAutotransport = this.productoHijo.id || 0;
    this.myForm.patchValue(this.productoHijo);
    this.idAutotransport != 0 ? (this.buttonTitle = 'Actualizar') : 'Guardar';
    this.setCompanyId();
  }
  ngOnInit(): void {
    this.myForm.get('configVehicular')?.valueChanges.subscribe((selectedNomenclature) => {
      const selectedConfig = this.configVehicularList.find(
        (config) => config.nomenclature === selectedNomenclature
      );
  
      if (selectedConfig) {
        this.myForm.patchValue({ tipoRemolque: selectedConfig.remolq });
      }
    });
  }
  setCompanyId(): void {
    const companyId = localStorage.getItem('company');
    console.log('seteando empresa al formulario', companyId);
    if (companyId) {
      this.myForm.patchValue({
        company_id: companyId,
      });
    }
  }
  loadConfigVehicular(): void {
    this.autotransportService.getConfigVehicular().subscribe(
      (response) => {
        this.configVehicularList = response.data;
        console.log(response)
      },
      (error) => {
        console.error(
          'Error al obtener el catálogo de configuraciones vehiculares',
          error
        );
      }
    );
  }

  loadPermisos(): void {
    this.autotransportService.getPermisos().subscribe(
      (response) => {
        this.permisosList = response.data;
      },
      (error) => {
        console.error('Error al obtener el catálogo de permisos SCT', error);
      }
    );
  }

  myForm: FormGroup = this.fb.group({
    configVehicular: ['', [Validators.required]],
    anioModeloVM: ['', [Validators.required,Validators.minLength(4),Validators.maxLength(4), Validators.pattern(PATRON_ANIO)]],
    placaVM: [  '', [  Validators.required,  Validators.minLength(5),  Validators.pattern(PATRON_PLACAVM), ], ],
    pesoBrutoVehicular: ['', [Validators.required, Validators.pattern(DECIMALES) ,Validators.min(0.01)]],
    permSCT: ['', [Validators.required]],
    numPermisoSCT: ['', [Validators.required, Validators.minLength(1)]],
    aseguraRespCivil: ['', [Validators.required, Validators.minLength(3)]],
    polizaRespCivil: ['', [Validators.required, Validators.minLength(3)]],
    company_id: ['', [Validators.required]],
    tipoRemolque: ['',],

  });
  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }
  closeModal(): void {
    this.resetAutotransport();
    this.idAutotransport = 0;
    this.buttonTitle = 'Crear';
  }
  onSubmit(): void {
    this.showLoader = true;
    console.log(this.myForm.value)
    if (this.myForm.invalid) {
      this.showLoader = false;
      this.myForm.markAllAsTouched();
      console.log('Formulario inválido. Por favor corrija los errores.');
      return;
    }
    const formData = this.myForm.value;
    // const companyId = localStorage.getItem('company');
    // const customerData = { ...formData, company_id: companyId };
    console.log('Datos a enviar:', formData);

    const submitCustomer = this.idAutotransport
      ? this.autotransportService.updateAutotransport(
        this.idAutotransport,
        formData
      )
      : this.autotransportService.createAutotransport(formData);
    this.subscription.add(
      submitCustomer.subscribe(
        (response) => {
          this.showLoader = false;
          this.respuesta.emit(response);
          console.log('Respuesta del servidor:', response);
          if (!response.error) {
            // this.myForm.reset();
            // this.closeModal();
          }
        },
        (error) => {
          console.error('Error al enviar los datos del autotransporte', error);
          this.showLoader = false;
        }
      )
    );
  }

  resetAutotransport(): void {
    this.myForm.reset({
      configVehicular: '',
      anioModeloVM: '',
      placaVM: '',
      pesoBrutoVehicular: '',
      permSCT: '',
      numPermisoSCT: '',
      aseguraRespCivil: '',
      polizaRespCivil: '',
      company_id: '',
    });
    // this.idAutotransport = 0;
    // this.buttonTitle = 'Crear';
    this.setCompanyId();
  }
}
