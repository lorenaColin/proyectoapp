import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PATRON_RFC, PATRON_EMAIL, PATRON_PHONE, PATRON_CURP } from '../../../../shared/utils/expressions';

import { RegimenInterface } from '../../../../shared/interfaces/shared.interface';
import { ValidatorsService } from '../../../../shared/services/validators.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { CompanyService } from '../../../services/company.service';
import { CompanyListInterface } from '../../../interfaces/company.interface';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss'
})
export class CompanyFormComponent implements OnInit  {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private utilsService = inject(UtilsService);
  private companyService = inject(CompanyService);
  listadoRegimen: RegimenInterface[] = [];
  listadoEmpresas: CompanyListInterface[] = [];

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(254)]],
    rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13), Validators.pattern(PATRON_RFC)]],
    curp: ['', [Validators.minLength(18), Validators.maxLength(18), Validators.pattern(PATRON_CURP)]],
    employee_registration: ['',[Validators.minLength(1), Validators.maxLength(40)]],
    email: ['', [Validators.required, Validators.pattern(PATRON_EMAIL)]],
    phone: ['', [Validators.required, Validators.maxLength(13), Validators.pattern(PATRON_PHONE)]],
    cp: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    regime: [this.listadoRegimen, [Validators.required]],
    address: ['']
  });

  ngOnInit(): void {
    this.companyService.listCompany().subscribe((response) => {
      let { error, data } = response;
      if(error) return console.error('Error al obtener las empresas');
      // this.listadoEmpresas = data;
    });
  }

  onInputRFC(event: Event): void {
    const el = event.target as HTMLInputElement;
    const rfcValue = el.value;
    this.listadoRegimen = [];
    if(rfcValue.length < 12 || rfcValue.length > 13) return;
    if( rfcValue.length == 12) this.myForm.patchValue({ curp: '', employee_registration: '' });
    this.listadoRegimen = this.utilsService.getRegimenSat( rfcValue );
  }

  cpSearch(event: Event): void {
    const el = event.target as HTMLInputElement;
    const cpValue = el.value;
    this.utilsService.getCpSat( cpValue );
  }


  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField( this.myForm, field );
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError( this.myForm, field );
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    
    this.companyService.createCompany(this.myForm.value).subscribe( (response) => {
      const { error, data, message } = response;

      if (error) {
        console.error(message);
        return
      }
      
      this.myForm.reset();
      console.log({message, data,});
    });
  

  }

  closeModal(): void {
    this.myForm.reset();
  }

}
