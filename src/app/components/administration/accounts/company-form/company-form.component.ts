import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  PATRON_RFC,
  PATRON_EMAIL,
  PATRON_PHONE,
  PATRON_CURP,
} from '../../../../shared/utils/expressions';

import { RegimenInterface } from '../../../../shared/interfaces/shared.interface';
import { ValidatorsService } from '../../../../shared/services/validators.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { CompanyService } from '../../../services/company.service';
import {
  CompanyInterface,
  CompanyListInterface,
} from '../../../interfaces/company.interface';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss',
})
export class CompanyFormComponent implements OnInit {
  @Output() respuestaHijo = new EventEmitter<CompanyListInterface>();
  @Input() productoHijo!: CompanyInterface;
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private utilsService = inject(UtilsService);
  private companyService = inject(CompanyService);
  public banderaFisica: boolean = false;
  listadoRegimen: RegimenInterface[] = [];
  empresaExiste: boolean = false;
  idCompany = 0;
  selectedFile: File | null = null;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(254)]],
    rfc: [
      '',
      [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(13),
        Validators.pattern(PATRON_RFC),
      ],
    ],
    curp: [
      '',
      [
        Validators.minLength(18),
        Validators.maxLength(18),
        Validators.pattern(PATRON_CURP),
      ],
    ],
    employee_registration: [
      '',
      [Validators.minLength(1), Validators.maxLength(40)],
    ],
    email: ['', [Validators.required, Validators.pattern(PATRON_EMAIL)]],
    phone: [
      '',
      [
        Validators.required,
        Validators.maxLength(13),
        Validators.pattern(PATRON_PHONE),
      ],
    ],
    cp: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
    ],
    regime: [this.listadoRegimen, [Validators.required]],
    address: [''],
  });

  formularioSellos: FormGroup = this.fb.group({
    company_id: [''],
    dateInit: ['', [Validators.required]],
    dateVig: ['', [Validators.required]],
    certificate: ['', [Validators.required]],
    private_key: ['', [Validators.required]],
    password_key: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {}

  ngOnChanges(): void {
    // this.idCustomer = this.productoHijo.id || 0;
    this.myForm.patchValue(this.productoHijo);
    // this.idCustomer != 0 ? (this.buttonTitle = 'Actualizar') : 'Guardar';
    this.listadoRegimen = this.utilsService.getRegimenSat(
      this.productoHijo.rfc
    );
    const rfcValue = this.productoHijo.rfc || '';
    this.onInputRFC({ target: { value: rfcValue } } as any);
    const empresaId = this.productoHijo.id;
    if (empresaId) {
      this.checkEmpresaExistente(empresaId);
      this.formularioSellos.patchValue({
        company_id: this.productoHijo.id,
      });
    }
  }

  checkEmpresaExistente(id: string): void {
    this.companyService.getCompanyById(id).subscribe(
      (response) => {
        this.empresaExiste = !!response;
        console.log('Empresa encontrada; ', response);
        console.log(this.empresaExiste);
      },
      (error) => {
        console.error('Error al verificar la empresa:', error);
      }
    );
  }
  onInputRFC(event: Event): void {
    this.banderaFisica = false;
    const el = event.target as HTMLInputElement;
    const rfcValue = el.value;
    this.listadoRegimen = [];
    if (rfcValue.length < 12 || rfcValue.length > 13) return;

    this.banderaFisica = rfcValue.length === 13 ? true : false;

    if (rfcValue.length == 12)
      this.myForm.patchValue({ curp: '', employee_registration: '' });
    this.listadoRegimen = this.utilsService.getRegimenSat(rfcValue);
  }

  cpSearch(event: Event): void {
    const el = event.target as HTMLInputElement;
    const cpValue = el.value;
    this.utilsService.getCpSat(cpValue);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  isValidField2(field: string): boolean | null {
    return this.validatorsService.isValidField(this.formularioSellos, field);
  }

  getFieldError2(field: string): string | null {
    return this.validatorsService.getFieldError(this.formularioSellos, field);
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const formData = this.myForm.value;
    this.companyService.createCompany(formData).subscribe((response) => {
      const { error, data, message } = response;

      if (error) {
        Swal.fire('Mensaje', message, 'error');
        return;
      }
      this.myForm.reset();
      this.respuestaHijo.emit(data[0]);
    });
  }
  onSubmit2(): void {
    if (this.formularioSellos.invalid) {
      this.formularioSellos.markAllAsTouched();
      return;
    }

    // const formData = this.formularioSellos.value;
    const formData = new FormData();
    formData.append('company_id', this.formularioSellos.value.company_id);
    formData.append('dateInit', this.formularioSellos.value.dateInit);
    formData.append('dateVig', this.formularioSellos.value.dateVig);
    formData.append('certificate', this.formularioSellos.value.certificate);
    formData.append('private_key', this.formularioSellos.value.private_key);
    formData.append('password_key', this.formularioSellos.value.password_key);
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    this.companyService.loadSeals(formData).subscribe((response) => {
      const { error, data, message } = response;
      if (error) {
        Swal.fire('Mensaje', message, 'error');
        return;
      }
      this.formularioSellos.reset();
    });
  }
  
  closeModal(): void {
    this.formCompanyReset();
  }

  formCompanyReset(): void {
    console.log('resetting');
    this.myForm.reset({
      name: '',
      address: '',
      cp: '',
      curp: '',
      status: true,
      rfc: '',
      regime: '',
      employee_registration: '',
      type: '',
      email: '',
      phone: '',
      logo: '',
    });
    // this.buttonTitle = 'Guardar';
    // this.idCustomer = 0;
    this.listadoRegimen = [];
  }

  closeModal2(): void {
    this.formCompanyReset();
    this.formCertificatesReset();
  }
  formCertificatesReset(): void {
    console.log('Resetting form and disabling controls');
    this.formularioSellos.reset({
      dateInit: '',
      dateVig: '',
      certificate: '',
      private_key: '',
      password_key: '',
    });
    this.formularioSellos.disable();
    this.empresaExiste = false;
  }
}
