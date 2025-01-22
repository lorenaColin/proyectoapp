import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConceptsService } from '../../services/concepts.service';
import { ConceptInterface } from '../../interfaces/concept';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { TotalsService } from '../../services/totals.service';
import { VALOR_IVA_T } from '../../../shared/utils/expressions';

@Component({
  selector: 'app-form-invoice-products',
  templateUrl: './form-invoice-products.component.html',
  styleUrl: './form-invoice-products.component.scss'
})
export class FormInvoiceProductsComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private conceptsService = inject(ConceptsService);
  private validatorsService = inject(ValidatorsService);
  private totalsService = inject(TotalsService);
  
  currentTab: number = 1; 
  formConcepts: FormGroup = this.fb.group({});
  idConcept: number = 0;
  tittleButton: string = 'Crear';
  isTableActive: boolean = false; 
  isCreateActive: boolean = true; 
  isTax: boolean = false;
  
  @Input() typeProof!: string; 
  @Output() productAdded = new EventEmitter<any>(); 
  @Input() productToEdit!: ConceptInterface; 
  
  
  ngOnInit(): void {
    this.createForm();
    this.valueChangesConcepts() 
    this.initTaxes();
  }
    
  ngOnChanges(): void {
    console.log(this.idConcept);
    this.idConcept = this.productToEdit.idTemp || 0;
    if (this.idConcept !== 0) {
      this.tittleButton = 'Actualizar';
  
      const productData = {
        ...this.productToEdit,
        ...this.productToEdit.traslados,
        ...this.productToEdit.retenciones
      };
  
      this.formConcepts.patchValue(productData);
      // console.log(this.productToEdit);
    }
  }
  
  

  createForm(): void {
    const formFields: any = {
      product_service_code: ['', Validators.required],
      name_product: [''],
      description: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min( this.typeProof !== 'T' ? 0.000001 : 0)]],
      unit_value: '',
      unit_price: [0, [Validators.required, Validators.min(this.typeProof !== 'T' ? 0.000001 : 0)]],
      unit_key: '',
      identification_number: '',
      discount: 0,
      // discount_percentage: 0,
      // base: 0,
      total_product: 20,
      tax_object: ['01', Validators.required],
    };
  
    if (this.typeProof !== 'T') {
      Object.assign(formFields, {
        validate_iva: false,
        validate_ieps: false,
        validate_r_iva: false,
        validate_r_ieps: false,
        validate_r_isr: false,
        validate_ish: false,
        base_iva: ['', Validators.required],
        valor_iva: ['', [Validators.required]],
        importe_iva: ['', Validators.required],
        base_ieps: ['', Validators.required],
        valor_ieps: ['', Validators.required],
        importe_ieps: ['', Validators.required],
        base_r_iva: ['', Validators.required],
        valor_r_iva: ['', [Validators.required, Validators.min(0.000000), Validators.max(0.160000)]],
        importe_r_iva: ['', Validators.required],
        base_r_ieps: ['', Validators.required],
        valor_r_ieps: ['', Validators.required],
        importe_r_ieps: ['', Validators.required],
        base_r_isr: ['', Validators.required],
        valor_r_isr: ['', [Validators.required, Validators.min(0.000000), Validators.max(0.350000)]],
        importe_r_isr: ['', Validators.required],
        base_ish: ['', Validators.required],
        valor_ish: ['', Validators.required],
        importe_ish: ['', Validators.required],
      });
    }
  
    this.formConcepts = this.fb.group(formFields);
  }
  closeModal() {
    this.formConceptsReset();
  }

  selectTab(isTable: boolean): void {
    this.isTableActive = isTable;
    this.isCreateActive = !isTable;
  }




addProduct(): void {
  console.log("Formulario invalido");
  if (this.formConcepts.invalid) {
    this.formConcepts.markAllAsTouched();
  
    Object.keys(this.formConcepts.controls).forEach(controlName => {
      const control = this.formConcepts.get(controlName);
      if (control && control.invalid) {
        console.log(`El campo ${controlName} es inválido.`);
      }
    });
  
    return;
  }
  
  const productData = this.formConcepts.value;
  const idTemp = this.idConcept !== 0 ? this.idConcept : Date.now();
  const productGroup = this.createProductGroup(productData, idTemp);
  const formArray = this.conceptsService.getProductosFormArray();
  
  (this.idConcept !== 0) ? this.updateProduct(formArray, productGroup, idTemp, productData) : this.addNewProduct(formArray, productGroup, idTemp, productData);
  
  this.formConcepts.reset();
  this.formConceptsReset();
  this.typeProof !== 'T' ? this.totalsService.calculateTotals() : '';
}

private createProductGroup(productData: any, idTemp: number): any {
  const productGroup: any = {
    idTemp: idTemp,
    product_service_code: productData.product_service_code,
    name_product: productData.name_product,
    description: productData.description,
    quantity: productData.quantity,
    unit_value: productData.unit_value,
    unit_price: productData.unit_price,
    predial: productData.predial,
    unit_key: productData.unit_key,
    identification_number: productData.identification_number,
    discount: productData.discount,
    discount_percentage: productData.discount_percentage,
    base: productData.base,
    total_product: productData.total_product,
    tax_object: this.typeProof !== 'T' ? productData.tax_object : '01',
    ...(this.typeProof !== 'T' && {
    validate_iva: productData.validate_iva,
    validate_ieps: productData.validate_ieps,
    validate_ish: productData.validate_ish,
    validate_r_iva: productData.validate_r_iva,
    validate_r_ieps: productData.validate_r_ieps,
    validate_r_isr: productData.validate_r_isr,
    })
  };
   if (this.typeProof !== 'T') {
      productGroup.traslados = this.fb.group({
       base_iva: productData.base_iva,
       valor_iva: productData.valor_iva,
       importe_iva: productData.importe_iva,
       base_ieps: productData.base_ieps,
       valor_ieps: productData.valor_ieps,
       importe_ieps: productData.importe_ieps,
       base_ish: productData.base_ish,
       valor_ish: productData.valor_ish,
       importe_ish: productData.importe_ish
      });
      productGroup.retenciones = this.fb.group({
       base_r_iva: productData.base_r_iva,
       valor_r_iva: productData.valor_r_iva,
       importe_r_iva: productData.importe_r_iva,
       base_r_ieps: productData.base_r_ieps,
       valor_r_ieps: productData.valor_r_ieps,
       importe_r_ieps: productData.importe_r_ieps,
       base_r_isr: productData.base_r_isr,
       valor_r_isr: productData.valor_r_isr,
       importe_r_isr: productData.importe_r_isr,
      });
     }

  return productGroup;
}

updateProduct(formArray: FormArray, productGroup: any, idTemp: number, productData: any): void {
  const index = formArray.controls.findIndex(control => control.value.idTemp === this.idConcept);
  if (index !== -1) {

    formArray.at(index).patchValue({
      ...productGroup,
      ...(this.typeProof !== 'T' && {
        traslados: productGroup.traslados.value,  
        retenciones: productGroup.retenciones.value  
      })
    });

    this.emitProductEvent(productData, idTemp, true);
  }
}


  addNewProduct(formArray: FormArray, productGroup: any, idTemp: number, productData: any): void {
  formArray.push(this.fb.group(productGroup));

  this.emitProductEvent(productData, idTemp, false);

}

  emitProductEvent(productData: any, idTemp: number, isUpdate: boolean): void {
  this.productAdded.emit({
    idTemp: idTemp,
    codigo: productData.product_service_code,
    descripcion: productData.description,
    cantidad: productData.quantity,
    precioUnitario: productData.unit_price,
    descuento: productData.discount,
    objetoImp: productData.tax_object,
    importe: productData.total_product,
    isUpdate: isUpdate,
  });
}

  formConceptsReset(): void{
    console.log("resetting");
    this.formConcepts.reset(
      {
        tax_object: '01',
        quantity: 0,
        unit_price: 0,
        total_product: 0,
      }
    );
    this.tittleButton = 'Crear';
    this.idConcept = 0;
  }

  valueChangesConcepts() {
    this.formConcepts.get('tax_object')?.valueChanges.subscribe(value => {
      this.isTax = value === '02';
    });
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.formConcepts, field);
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField( this.formConcepts, field );
  }
  
  onCheckChange(tasaOCuota: string): void{
    console.log(tasaOCuota);
  }

  initTaxes(): void {
    const taxTypes = ['iva', 'ieps', 'r_iva', 'r_ieps', 'r_isr', 'ish'];
  
    taxTypes.forEach((tax) => {
      const isChecked = this.formConcepts.get(`validate_${tax}`)?.value;
      this.toggleTaxFields(tax, isChecked);
  
      this.formConcepts.get(`validate_${tax}`)?.valueChanges.subscribe((value) => {
        this.toggleTaxFields(tax, value);
      });
    });
  }

  toggleTaxFields(tax: string, enable: boolean): void {
    [`base_${tax}`, `valor_${tax}`, `importe_${tax}`].forEach((field) => {
      const control = this.formConcepts.get(field);
      control?.[enable ? 'enable' : 'disable']();
      if (!enable) control?.setValue(null);
    });
  }
  
  

}
