import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ConceptsService } from '../../services/concepts.service';
import { ConceptInterface, productInterface } from '../../interfaces/concept';
import { ValidatorsService } from '../../../shared/services/validators.service';
import Decimal from 'decimal.js';

import {  impuestoInterface, } from '../../../shared/interfaces/shared.interface';
import { UtilsService } from '../../../shared/services/utils.service';


@Component({
  selector: 'app-form-invoice-products',
  templateUrl: './form-invoice-products.component.html',
  styleUrl: './form-invoice-products.component.scss'
})
export class FormInvoiceProductsComponent implements OnInit, OnChanges {


  private fb = inject(FormBuilder);
  private conceptsService = inject(ConceptsService);
  private validatorsService = inject(ValidatorsService);
  private utilsService = inject(UtilsService);

  @Input() typeProof!: string; 
  public daniel:any ;

  currentTab: number = 1; 
  formConcepts = this.fb.group({
    id: [Date.now()],
    name_product: [],
    product_service_code: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    quantity: [0, [Validators.required, Validators.min( this.typeProof !== 'T' ? 0.000001 : 0)], []],
    unit_value: [''],
    unit_price: [0, [Validators.required, Validators.min(this.typeProof !== 'T' ? 0.000001 : 0)]],
    unit_key: [''],
    identification_number: [''],
    discount: [],
    valorUnitario: [0],
    base: [0],
    total_product: [0, [Validators.required, Validators.min(this.typeProof !== 'T' ? 0.000001 : 0)]],
    tax_object: ['01', Validators.required],
    traslados: this.fb.array([]),
    retenidos: this.fb.array([]),
  },{
    validators: [this.validatorsService.isFieldOneEqualFieldTax('tax_object','traslados')]
  });

  idConcept: number = 0;
  tittleButton: string = 'Crear';
  isTableActive: boolean = false; 
  isCreateActive: boolean = true; 
  isTax: boolean = false;
  public base: number = 0;

  
  
  @Output() productAdded = new EventEmitter<any>(); 
  @Input() productToEdit!: ConceptInterface; 
  

  ngOnInit(): void {
    this.susb();
    this.susb2();
  }

  susb(){
    ['quantity', 'unit_price', 'discount'].forEach(field => {
      const control = this.formConcepts.get(field);
      if (control) {
        control.valueChanges.subscribe((x) => this.calculate());
      }
    });
  }
  susb2(){
    this.formConcepts.get('tax_object')?.valueChanges.subscribe(value => {
      this.isTax = value === '02';   
      this.traslados.clear();
      this.retenidos.clear();
      if(value != '02'){
        console.log(this.daniel)
        console.log(this.daniel.unsubscribe());
        console.log(this.daniel)

      }
      if (value === '02') {
        this.traslados.push(this.fb.group({
          base: 0,
          descripcion: "IVA",
          impuesto: "002",
          tasaOCuota: ["0.160000"],
          importe: 0
        }));
        this.traslados.push(this.fb.group({
          base: 0,
          descripcion: "IEPS",
          impuesto: "003",
          tasaOCuota: ["N/A"],
          importe: 0
        }));

        this.retenidos.push(this.fb.group({
          base: 0,
          descripcion: "R.IVA",
          impuesto: "002",
          tasaOCuota: ['', [Validators.min(0.000001), Validators.max(0.16000)]],
          importe: 0
        }));
        this.retenidos.push(this.fb.group({
          base: 0,
          descripcion: "R. ISR",
          impuesto: "001",
          tasaOCuota: ['', [Validators.min(0.000001), Validators.max(0.350000)]],
          importe: 0
        }));
        this.retenidos.push(this.fb.group({
          base: 0,
          descripcion: "R. IEPS",
          impuesto: "003",
          tasaOCuota: ['', [], []],
          importe: 0
        }));
        this.susb3();
      }
      this.calculate();
    });
  }

  susb3(){
    this.retenidos.controls.map(control => {
      let field =control.get('tasaOCuota');
      if(field){
        this.daniel = field.valueChanges.subscribe((x) => this.calculate());
      }
    });
  }

    
  ngOnChanges(): void {
    // console.log(this.idConcept);
    // this.idConcept = this.productToEdit.idTemp || 0;
    // if (this.idConcept !== 0) {
    //   this.tittleButton = 'Actualizar';
  
    //   const productData = {
    //     ...this.productToEdit,
    //     ...this.productToEdit.traslados,
    //     ...this.productToEdit.retenciones
    //   };
  
    //   // this.formConcepts.patchValue(productData);
    //   // console.log(this.productToEdit);
    // }
  }
  
  onSubmit() {
    if (this.formConcepts.invalid) {
      this.formConcepts.markAllAsTouched();
      return;
    }
    const { tax_object, retenidos }   = this.formConcepts.value;
    if(tax_object == '02'){
      let index:number = 0;
      this.traslados.controls.map( field => {
        let tasaOCuota = field.get('tasaOCuota')?.value;
        if(tasaOCuota === 'N/A') {
          this.traslados.removeAt(index);
        }
        index++;
      });

      let retEl = retenidos!.filter((r:any) => r.base !== 0);
      this.retenidos.clear()
      if(retEl.length> 0){
        retEl.forEach((element:any) => {
          this.retenidos.push(this.fb.group(element))
        });
      }
    }
    let data: any  = this.formConcepts.value;
    console
    this.conceptsService.products.update(value =>[...value, data]);
    this.conceptsService.calculateTotals();
    this.formConceptsReset();
  }


  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.formConcepts, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField( this.formConcepts, field );
  }

  isValidField2(formulario: string, index: number, fieldName: string): boolean {
    const formArray = this.formConcepts.get(formulario) as FormArray;
    const control = formArray.at(index)?.get(fieldName);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  getFieldError2(formulario: string, index: number, fieldName: string): string | null {
    const formArray = this.formConcepts.get(formulario) as FormArray;
    const errors = formArray.at(index)?.get(fieldName)?.errors || {};
    return this.validatorsService.menssages(errors, fieldName);
  }
  closeModal() {
    this.formConceptsReset();
  }

  selectTab(isTable: boolean): void {
    this.isTableActive = isTable;
    this.isCreateActive = !isTable;
  }

  get traslados(): FormArray {
    return this.formConcepts.get('traslados') as FormArray;
  }

  get retenidos(): FormArray {
    return this.formConcepts.get('retenidos') as FormArray;
  }

  calculate(){
    const cantidad = this.formConcepts.get('quantity')!.value || 0;
    const unit_price = this.formConcepts.get('unit_price')!.value || 0;
    const descuento = this.formConcepts.get('discount')!.value  || 0;
    const tax_object = this.formConcepts.get('tax_object')!.value  || 0;
    if( Number(cantidad) === 0 || Number(unit_price) === 0 ) return;


    let cantidadBase = parseFloat(new Decimal(this.utilsService.decimales(cantidad.toString())).toString());
    console.log(new Decimal(cantidadBase).mul(new Decimal(this.utilsService.decimales(unit_price.toString()))).toString())
    let valorUnitario = parseFloat(new Decimal(cantidadBase).mul(new Decimal(this.utilsService.decimales(unit_price.toString()))).toString());
    let base = parseFloat((new Decimal(valorUnitario).sub(descuento.toString())).toString());
    console.log(cantidadBase, valorUnitario, base)
    let trasladosTotal = new Decimal(0);
    let retencionesTotal = new Decimal(0);

    if(tax_object === "02"){
      let index: number = 0;
      this.traslados.controls.map(control => {
        let tasaOCuota = control.get('tasaOCuota')!.value;
        let importe = new Decimal(0.0);

        if(!isNaN(parseFloat(tasaOCuota))){
          let tasa = tasaOCuota === "Exento" ? "0.00000": tasaOCuota;
          importe = new Decimal(new Decimal(base)).mul(new Decimal(tasa))
          trasladosTotal = new Decimal(this.utilsService.decimales(new Decimal(trasladosTotal).toString())).add(new Decimal(importe));
        }
        this.traslados.controls[index].get('base')?.setValue(parseFloat(base.toString()));
        this.traslados.controls[index].get('importe')?.setValue(parseFloat(importe.toString()));
        index++;
      });

      index = 0;
      this.retenidos.controls.map(control => {
        let tasaOCuota = control.get('tasaOCuota')?.value
        let importe = 0;
        let baseTemp = 0; 
        if(!isNaN(parseFloat(tasaOCuota))){
          baseTemp = base;
          let tasa = tasaOCuota === "Exento" ? "0.00000": tasaOCuota;
          importe = parseFloat(new Decimal(new Decimal(base)).mul(new Decimal(tasa)).toString())
          retencionesTotal = new Decimal(this.utilsService.decimales(new Decimal(retencionesTotal).toString())).add(new Decimal(importe));
        }
        this.retenidos.controls[index].get('base')?.setValue(baseTemp);
        this.retenidos.controls[index].get('importe')?.setValue(importe);
        index++;
      });
    }
    let total_product =  parseFloat((new Decimal(valorUnitario).sub(descuento).add(new Decimal(trasladosTotal.toString()))).sub(new Decimal(retencionesTotal.toString())).toString());
    this.formConcepts.patchValue({total_product, valorUnitario, base: base});
    
  }



  formConceptsReset(): void{
    console.log("resetting");
    this.formConcepts.reset({
      id: Date.now(),
      tax_object: '01',
      quantity: 0,
      unit_price: 0,
      total_product: 0,
    });
    this.tittleButton = 'Crear';
    this.idConcept = 0;
  }


}
