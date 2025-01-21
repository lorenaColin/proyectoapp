import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConceptsService } from '../../services/concepts.service';
import { ConceptInterface } from '../../interfaces/concept';

@Component({
  selector: 'app-form-invoice-products',
  templateUrl: './form-invoice-products.component.html',
  styleUrl: './form-invoice-products.component.scss'
})
export class FormInvoiceProductsComponent implements OnInit, OnChanges {
  currentTab: number = 1; 
  private fb = inject(FormBuilder);
  private conceptsService = inject(ConceptsService);
  @Input() typeProof!: string; 
  formConcepts: FormGroup = this.fb.group({});
  idConcept: number = 0;
  
  @Output() productAdded = new EventEmitter<any>(); 
  @Input() productToEdit!: ConceptInterface; 
  
  
  ngOnInit(): void {
    console.log('init');
    this.createForm();
  }

  ngOnChanges(): void {
    console.log('changeInit', this.productToEdit);
    console.log(this.idConcept);
    this.idConcept = this.productToEdit.idTemp || 0;
    if (this.idConcept != 0) {
      console.log('change', this.typeProof);
      this.formConcepts.patchValue(this.productToEdit); 
      console.log(this.productToEdit);
    }
  }

  createForm(): void {
    const formFields: any = {
      product_service_code: '',
      name_product: '',
      description: '',
      quantity: '',
      unit_value: '',
      unit_price: '',
      unit_key: '',
      identification_number: '',
      discount: '',
      discount_percentage: '',
      base: '',
      total_product: '',
      tax_object: '',
    };
  
    if (this.typeProof !== 'T') {
      Object.assign(formFields, {
        tax_iva: '',
        rate_iva: '',
        tax_ieps: '',
        rate_ieps: '',
        ret_iva: '',
        ret_isr: '',
        ret_ieps: '',
        tax_ish: ''
      });
    }
  
    this.formConcepts = this.fb.group(formFields);
  }
  closeModal() {
    console.log('close modal');
    this.idConcept = 0;
    this.formConcepts.reset();
    console.log(this.formConcepts.value);
    this.productToEdit = {} as ConceptInterface;
    console.log(this.productToEdit);
  }

  isTableActive: boolean = false; 
  isCreateActive: boolean = true; 
  isTax: boolean = false;

  selectTab(isTable: boolean): void {
    this.isTableActive = isTable;
    this.isCreateActive = !isTable;
  }

  objectTax(event: Event) {
    const valueObject = (event.target as HTMLInputElement).value;
    this.isTax = valueObject === '02' ? true : false;
    // console.log(valueObject);
  }

  addProduct(): void {
    const productData = this.formConcepts.value;
    const idTemp = Date.now();
  
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
    };
  
    if (this.typeProof !== 'T') {
      productGroup.tax_object = productData.tax_object;
      productGroup.taxes = this.fb.group({
        tax_iva: productData.tax_iva,
        rate_iva: productData.rate_iva,
        tax_ieps: productData.tax_ieps,
        rate_ieps: productData.rate_ieps,
        tax_ish: productData.tax_ish,
      });
      productGroup.holdings = this.fb.group({
        ret_iva: productData.ret_iva,
        ret_isr: productData.ret_isr,
        ret_ieps: productData.ret_ieps,
      });
    }
  
    this.conceptsService.getProductosFormArray().push(this.fb.group(productGroup));
  
    this.productAdded.emit({
      idTemp: idTemp,
      codigo: productData.product_service_code,
      descripcion: productData.description,
      cantidad: productData.quantity,
      precioUnitario: productData.unit_price,
      descuento: productData.discount,
      objetoImp: productData.tax_object,
      importe: productData.total_product,
    });
  
    console.log(this.conceptsService.getProductosFormArray().value);
  
    this.formConcepts.reset();
    console.log("Reset");
    console.log(this.formConcepts);
  }
  
}
