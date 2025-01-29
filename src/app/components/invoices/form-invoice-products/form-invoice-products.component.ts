import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConceptsService } from '../../services/concepts.service';
import { ConceptInterface } from '../../interfaces/concept';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { TotalsService } from '../../services/totals.service';
import Decimal from 'decimal.js';
import { CurrencyPipe, DecimalPipe } from '@angular/common'

import {  impuestoInterface, } from '../../../shared/interfaces/shared.interface';


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

  private cp = inject(CurrencyPipe);
  private dp = inject(DecimalPipe);
  
  currentTab: number = 1; 
  formConcepts: FormGroup = this.fb.group({});
  idConcept: number = 0;
  tittleButton: string = 'Crear';
  isTableActive: boolean = false; 
  isCreateActive: boolean = true; 
  isTax: boolean = false;
  public base: number = 0;
  formTraslados = this.fb.array([]);
  
  @Input() typeProof!: string; 
  @Output() productAdded = new EventEmitter<any>(); 
  @Input() productToEdit!: ConceptInterface; 
  
  public formFields: any ={}
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
    
    this.formFields = {
      name_product: [''],
      product_service_code: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      quantity: [0, [Validators.required, Validators.min( this.typeProof !== 'T' ? 0.000001 : 0)], []],
      unit_value: [''],
      unit_price: [0, [Validators.required, Validators.min(this.typeProof !== 'T' ? 0.000001 : 0)]],
      unit_key: [''],
      identification_number: [''],
      discount: [0],
      valorUnitario: [0],
      base: [this.base],
      total_product: [0, [Validators.required, Validators.min(this.typeProof !== 'T' ? 0.000001 : 0)]],
      tax_object: ['01', Validators.required],
      traslados: this.formTraslados
    };
  
    if (this.typeProof !== 'T') {

    }
  
    this.formConcepts = this.fb.group(this.formFields);
  }
  closeModal() {
    this.formConceptsReset();
  }

  selectTab(isTable: boolean): void {
    this.isTableActive = isTable;
    this.isCreateActive = !isTable;
  }


  setTraslado(event: any): void{
    const ischecked = (<HTMLInputElement>event.target).checked
    let elemento = event.target.id;
    let trasladosArray = this.formConcepts.get('traslados') as FormArray;

    if(!ischecked){
      let { value:traslados } = trasladosArray;
      let transladosTemp: impuestoInterface[] = traslados;
      trasladosArray.removeAt(transladosTemp.findIndex(x => x.impuesto === elemento ));
      return;
    }

    let validations = elemento === "iva" ? [Validators.required, Validators.min(0.000001), Validators.max(0.16000)]: [Validators.required];


    let impuestoD = this.fb.group({
        base: [this.base, [Validators.required]],
        impuesto: event.target.id,
        tasaOCuota: [0, [Validators.required]],
        retencion: [0, validations],
        importe: 0 
      });

    trasladosArray.push(impuestoD)
  }

  get traslados(): FormArray {
    return this.formConcepts.get('traslados') as FormArray;
  }

  calculate(){

    let {quantity:cantidad, unit_price, discount:descuento, tax_object, traslados}  = this.formConcepts.value;
    if( Number(cantidad) === 0 || Number(unit_price) === 0 ) return;

    cantidad = this.dp.transform(new Decimal(cantidad).toString(), '1.6-6')
    let valorUnitario = new Decimal(cantidad).mul(new Decimal(unit_price)).toString();
    let base = new Decimal(valorUnitario).sub(descuento).toString();
    this.base = Number(base);
    let trasladosTotal = new Decimal(0);
    let retencionesTotal = new Decimal(0);
    if(tax_object === "02"){
      traslados.forEach(( element: impuestoInterface) => {
        let { tasaOCuota } = element;
        let tasa = tasaOCuota === "Exento" ? "0.00000": tasaOCuota;
        let importe = new Decimal(new Decimal(base)).mul(new Decimal(tasa))
        trasladosTotal = new Decimal(this.calculos(new Decimal(trasladosTotal).toString())).add(new Decimal(importe));
        
      });
    }
    let total_product =  this.cp.transform((new Decimal(valorUnitario).sub(descuento).add(trasladosTotal)).sub(retencionesTotal).toString(), 'USD', 'symbol', '1.2-2');;
    this.formConcepts.patchValue({quatiry:cantidad,valorUnitario, base, total_product});

  }

  calculos(valor:string): string{
    let cadenaNumero = valor.toString();
    let posicionPunto = cadenaNumero.lastIndexOf('.');
    let esDecimal = posicionPunto != -1;
    let numeroEntero  = ( esDecimal ) ? cadenaNumero.substr(0, posicionPunto) : cadenaNumero;
    let decimales = ( esDecimal ) ? cadenaNumero.substr(posicionPunto + 1 ) : "";
    decimales = decimales.length > 6 ? decimales.substr( 0, 6 ) : decimales.padEnd(6, "0");
    numeroEntero = numeroEntero.length === 0 ? "0": numeroEntero;
    return `${ numeroEntero }.${ decimales }`;
  }






addProduct(): void {
  console.log("Formulario invalido");
  if (this.formConcepts.invalid) {
    this.formConcepts.markAllAsTouched();
  
    Object.keys(this.formConcepts.controls).forEach(controlName => {
      const control = this.formConcepts.get(controlName);
      if (control && control.invalid) {
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
    // validate_iva: productData.validate_iva,
    // validate_ieps: productData.validate_ieps,
    // validate_ish: productData.validate_ish,
    // validate_r_iva: productData.validate_r_iva,
    // validate_r_ieps: productData.validate_r_ieps,
    // validate_r_isr: productData.validate_r_isr,
    })
  };
   if (this.typeProof !== 'T') {
      productGroup.traslados = this.fb.group({
      //  base_iva: productData.base_iva,
      //  valor_iva: productData.valor_iva,
      //  importe_iva: productData.importe_iva,
      //  base_ieps: productData.base_ieps,
      //  valor_ieps: productData.valor_ieps,
      //  importe_ieps: productData.importe_ieps,
      //  base_ish: productData.base_ish,
      //  valor_ish: productData.valor_ish,
      //  importe_ish: productData.importe_ish
      });
      productGroup.retenciones = this.fb.group({
      //  base_r_iva: productData.base_r_iva,
      //  valor_r_iva: productData.valor_r_iva,
      //  importe_r_iva: productData.importe_r_iva,
      //  base_r_ieps: productData.base_r_ieps,
      //  valor_r_ieps: productData.valor_r_ieps,
      //  importe_r_ieps: productData.importe_r_ieps,
      //  base_r_isr: productData.base_r_isr,
      //  valor_r_isr: productData.valor_r_isr,
      //  importe_r_isr: productData.importe_r_isr,
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

  isValidField2(index: number, fieldName: string): boolean {
    const formArray = this.formConcepts.get('traslados') as FormArray;
    const control = formArray.at(index)?.get(fieldName);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }
  getFieldError2(index: number, fieldName: string): string | null {
    const formArray = this.formConcepts.get('traslados') as FormArray;
    const control = formArray.at(index)?.get(fieldName);

    if (control && control.errors) {
      console.log(Object.values(control.errors)[0])
      return Object.values(control.errors)[0];
    }
    return null;
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
