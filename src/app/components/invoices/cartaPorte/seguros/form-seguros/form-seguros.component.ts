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
import { InsuranceService } from '../../../../services/insurance.service';
import { Subscription } from 'rxjs';
import {
  InsuranceInterface,
  InsuranceResponseInterface,
} from '../../../../interfaces/insurance.interface';

@Component({
  selector: 'app-form-seguros',
  templateUrl: './form-seguros.component.html',
  styleUrl: './form-seguros.component.scss',
})
export class FormSegurosComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private insuranceService = inject(InsuranceService);
  buttonTitle: string = 'Crear';
  private subscription: Subscription = new Subscription();
  @Input() productoHijo!: InsuranceInterface;
  @Output() respuesta = new EventEmitter<InsuranceResponseInterface>();
  clientes: InsuranceInterface[] = [];
  idInsurance = 0;
  showLoader = false;
  ngOnChanges(): void {
    this.idInsurance = this.productoHijo.id || 0;
    this.myForm.patchValue(this.productoHijo);
    this.idInsurance != 0 ? (this.buttonTitle = 'Actualizar') : 'Guardar';
    this.setCompanyId();
  }
  myForm: FormGroup = this.fb.group({
    type: ['', [Validators.required]],
    asegure: ['', [Validators.required,Validators.minLength(3)]],
    polize: ['', [Validators.required,Validators.minLength(3)]],
    company_id: ['', [Validators.required]],
  });
  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.myForm, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }
  closeModal(): void {
    this.resetInsurance();
    this.idInsurance = 0;
    this.buttonTitle = 'Crear';
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
  onSubmit(): void {
    this.showLoader = true;

    if (this.myForm.invalid) {
      this.showLoader = false;
      this.myForm.markAllAsTouched();
      console.log('Formulario inválido. Por favor corrija los errores.');
      return;
    }

    const formData = this.myForm.value;
    console.log('Datos a enviar:', formData);

    const submitCustomer = this.idInsurance
      ? this.insuranceService.updateInsurance(this.idInsurance, formData)
      : this.insuranceService.createInsurance(formData);
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

  resetInsurance(): void {
    this.myForm.reset({
      type: '',
      asegure: '',
      polize: '',
      company_id: '',
    });
    // this.idInsurance = 0;
    // this.buttonTitle = 'Crear';
    this.setCompanyId();
  }
}
