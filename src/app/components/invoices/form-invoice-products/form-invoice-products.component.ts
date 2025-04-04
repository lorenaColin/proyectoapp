import { Component, effect, EventEmitter, HostListener, inject, input, Input, OnChanges, OnInit, Output, signal } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ConceptsService } from '../../services/concepts.service';
import { ApiResponseConcepto, ConceptInterface, productInterface } from '../../interfaces/concept';
import { ValidatorsService } from '../../../shared/services/validators.service';
import Decimal from 'decimal.js';

import {  impuestoInterface, } from '../../../shared/interfaces/shared.interface';
import { UtilsService } from '../../../shared/services/utils.service';
import { debounceTime, Subject } from 'rxjs';
import { productoServicio } from '../../services/productoServicio.service';
import { ApiResponseConceptos, ApiResponseProducto, ProductInterface } from '../../interfaces/producto.interface';


@Component({
  selector: 'app-form-invoice-products',
  templateUrl: './form-invoice-products.component.html',
  styleUrl: './form-invoice-products.component.scss'
})
export class FormInvoiceProductsComponent implements OnInit {


  private fb = inject(FormBuilder);
  private conceptsService = inject(ConceptsService);
  private productoService = inject(productoServicio);

  private validatorsService = inject(ValidatorsService);
  private utilsService = inject(UtilsService);

  @Input() typeProof!: string; 
  idProduct = input.required()
  public daniel:any ;

  constructor(){

    effect(() => {
      if (this.idProduct()) {
        if(this.idProduct() != 0){
          // let concepto = this.conceptsService.getConcept();
          // let { claveInterna, claveProdServ, noIdentificacion, cantidad, descripcion, claveUnidad, unidad, valorUnitario, descuento, objetoImp, traslados, retenciones} = concepto
          // this.formConcepts.patchValue({claveInterna, claveProdServ, noIdentificacion, cantidad, descripcion, claveUnidad, unidad, valorUnitario, objetoImp})
          // if(objetoImp == "02"){
          //   // this.retenciones.controls.map(control => {
            

          //   // })
          // }
        }
      }
    });
  }


  currentTab: number = 1; 
  formConcepts = this.fb.group({
    id: [Date.now()],
    claveInterna: [''],
    claveProdServ: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
    noIdentificacion: ['', Validators.maxLength(100)],
    quantity: [0, [Validators.required, Validators.min( this.typeProof !== 'T' ? 0.000001 : 0)], []],
    cantidad: [''],
    descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
    claveUnidad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
    unidad: ['', [Validators.maxLength(20)]],
    unit_price: [0, [Validators.required, Validators.min(this.typeProof !== 'T' ? 0.000001 : 0)]],
    valorUnitario: [''],
    importe: [''],
    discount: ['',],
    descuento: ['',],
    objetoImp: ['01', Validators.required],
    base: [''],
    total_product: [0, [Validators.required, Validators.min(0)]],
    traslados: this.fb.array([]),
    retenciones: this.fb.array([]),

  },{
    validators: [this.validatorsService.isFieldOneEqualFieldTax('objetoImp','traslados')]
  });

  idConcept: number = 0;
  tittleButton: string = 'Crear';
  isTableActive: boolean = false; 
  isCreateActive: boolean = true; 
  isTax: boolean = false;
  public base: number = 0;

  
  
  @Output() productAdded = new EventEmitter<any>(); 
  @Input() productToEdit!: ConceptInterface; 
  buscar1 = new Subject<string>();

  ngOnInit(): void {
    this.susb();
    this.susb2();
    this.buscar1.pipe(
                  debounceTime(500),
                ).subscribe((query: string) => {
                  this.Buscar(query);
                });

  }
  showLoader = false;
  filteredConcepto: ProductInterface[] = [];

  onInput(event: any): void {
    const query = (event.target.value || '').trim().toLowerCase();
    // console.log('Buscando pais:', query);
    this.buscar1.next(query);
  }
private Buscar(query:string):void{
    const control = this.formConcepts.get('claveProdServ');
    if (!control) return;
    if (query.length === 0) {
      control.setErrors(null);
      
      if (control.hasValidator(Validators.required)) {
        control.setValidators([Validators.required]);
      }
      control.updateValueAndValidity();
      this.filteredConcepto = [];
      this.showLoader = false;
      return;
    }
    if (query.length < 2) {
      control.setErrors({ notFound: true });
      this.filteredConcepto = [];
      this.showLoader = false;
      return;
    }
    this.showLoader = true;
    this.productoService.getAllConceptos(query).subscribe({
          next: (response: ApiResponseConceptos) => {
            // console.log('Respuesta de la API:', response);
            this.filteredConcepto = response.data || [];
            // console.log('Productos obtenidos:', this.filteredConcepto);
    
            const exactMatch = this.filteredConcepto.some(producto =>
              producto.internal_key.toString().toLowerCase() === query 
            );
    
            if (!exactMatch) {
              control.setErrors({ notFound: true });
              this.limpiarCampos();
            } else {
              control.setErrors(null);
            }
    
            this.showLoader = false;
          },
          error: (err) => {
            // console.error('Error en la búsqueda de productos:', err);
            this.showLoader = false;
          }
        });
  }
  private limpiarCampos(): void {
    this.formConcepts.get('claveInterna')?.setValue('');
    this.formConcepts.get('claveProdServ')?.setValue('');
    this.formConcepts.get('claveUnidad')?.setValue('');
    this.formConcepts.get('noIdentificacion')?.setValue('');
    this.formConcepts.get('descripcion')?.setValue('');
    this.formConcepts.get('quantity')?.setValue(0);
    this.formConcepts.get('unit_price')?.setValue(0);
    this.claveConcepto = '';
  
  }
  
  selectedIndex: number = -1;

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      if (this.selectedIndex < this.filteredConcepto.length - 1) {
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
        this.selectConcepto(this.filteredConcepto[this.selectedIndex]);



      }
    }
  }
  claveConcepto: string = '';




  selectConcepto(concepto: ProductInterface): void {
    // console.log(concepto)
    let {
        internal_key: claveInterna, 
        product_key: claveProdServ,  
        unit: claveUnidad,
        unit_description: unidad,
        identifier_number: noIdentificacion,
        description: descripcion,
        quantity: quantity,
        // unit_price: valorUnitario,
      } = concepto;

    let producto = {
      claveInterna,
      claveProdServ,
      claveUnidad,
      unidad,
      noIdentificacion,
      descripcion,
      quantity,
      // valorUnitario
    }
    // // const descripcion = conceptos.description ?? ''; 
    // // const descriptionUnit = unidad; 
    
    // console.log({producto})
    this.formConcepts.patchValue(producto);
    // console.log(descripcion)
    // this.formConcepts.get('descripcion')?.setValue(descripcion.toString());
    // this.formConcepts.patchValue({descripcion});
    this.claveConcepto = concepto.internal_key;
    // this.formConcepts.get('claveProdServ')?.setValue(claveProdServ);
    // this.formConcepts.get('claveUnidad')?.setValue(claveUnidad);
    // this.formConcepts.get('descripcion')?.setValue(descripcion);
    // this.formConcepts.get('valorUnitario')?.setValue(valorUnitario);
    /*
    this.formConcepts.get('claveInterna')?.setValue(conceptos.internal_key);
    this.formConcepts.get('cantidad')?.setValue(conceptos.quantity);
    this.formConcepts.get('valorUnitario')?.setValue(conceptos.unit_price);
    this.formConcepts.get('noIdentificacion')?.setValue(conceptos.identifier_number);
      if (this.formConcepts.get('unit_description')) {
      // this.formConcepts.get('unit_description')?.setValue(descriptionUnit);
    }
    */
    this.filteredConcepto = [];
    this.selectedIndex = -1;

    this.formConcepts.get('claveProdServ')?.setErrors(null);
    const inputElement = document.getElementById('claveProdServ') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = this.claveConcepto;
    }
  }


  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('#claveProdServ')) {
      this.filteredConcepto = [];
    }
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
    this.formConcepts.get('objetoImp')?.valueChanges.subscribe(value => {
      this.isTax = value === '02';   
      this.traslados.clear();
      this.retenciones.clear();
      if(value != '02'){
        // console.log(this.daniel)
        // console.log(this.daniel.unsubscribe());
        // console.log(this.daniel)

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

        this.retenciones.push(this.fb.group({
          base: 0,
          descripcion: "R.IVA",
          impuesto: "002",
          tasaOCuota: ['', [Validators.min(0.000001), Validators.max(0.16000)]],
          importe: 0
        }));
        this.retenciones.push(this.fb.group({
          base: 0,
          descripcion: "R. ISR",
          impuesto: "001",
          tasaOCuota: ['', [Validators.min(0.000001), Validators.max(0.350000)]],
          importe: 0
        }));
        this.retenciones.push(this.fb.group({
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
    this.retenciones.controls.map(control => {
      let field =control.get('tasaOCuota');
      if(field){
        this.daniel = field.valueChanges.subscribe((x) => this.calculate());
      }
    });
  }


  addProduct() {
    if (this.formConcepts.invalid) {
      this.formConcepts.markAllAsTouched();
      return;
    }
    const { objetoImp, retenciones } = this.formConcepts.value;
    if(objetoImp == '02'){
      let index:number = 0;
      this.traslados.controls.map( field => {
        let tasaOCuota = field.get('tasaOCuota')?.value;
        if(tasaOCuota === 'N/A') {
          this.traslados.removeAt(index);
        }
        index++;
      });

      let retEl = retenciones!.filter((r:any) => r.base !== '0');
      this.retenciones.clear()
      if(retEl.length> 0){
        retEl.forEach((element:any) => {
          this.retenciones.push(this.fb.group(element))
        });
      }
    }
    let data: any  = this.formConcepts.value;
    // console.log(data)
    this.conceptsService.products.update(value =>[...value, data]);
    this.conceptsService.calculateTotals();
    this.conceptsService.setDataForm();
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

  get retenciones(): FormArray {
    return this.formConcepts.get('retenciones') as FormArray;
  }

  calculate(){
    let cantidad = this.formConcepts.get('quantity')!.value?.toString() || '0';
    let valorUnitario = this.formConcepts.get('unit_price')!.value?.toString() || '0';
    let descuento = this.formConcepts.get('discount')?.value?.toString() || 0
    // let descuento = this.formConcepts.get('discount')?.value? || 0;
    let objetoImp = this.formConcepts.get('objetoImp')!.value?.toString()  || '0';
    if( Number(cantidad) === 0 || Number(valorUnitario) === 0 ) return;

    // let cantidadBase = parseFloat(new Decimal(this.utilsService.decimales(cantidad.toString())).toString());
    cantidad = this.utilsService.decimales(cantidad.toString());
    valorUnitario = this.utilsService.decimales(valorUnitario.toString());
    descuento = this.utilsService.decimales(descuento.toString());

    let importe = this.utilsService.decimales(new Decimal(cantidad).mul(new Decimal(valorUnitario)).toString());
    let base = this.utilsService.decimales(new Decimal(importe).sub(descuento).toString());
    let trasladosTotal = new Decimal(0);
    let retencionesTotal = new Decimal(0);
    
    if(objetoImp === "02"){
      let index: number = 0;
      this.traslados.controls.map(control => {
        let tasaOCuota = control.get('tasaOCuota')!.value;
        let importe = new Decimal(0.0).toString();

        if(!isNaN(parseFloat(tasaOCuota))){
          let tasa = tasaOCuota === "Exento" ? "0.00000": tasaOCuota;
          importe = new Decimal(base).mul(tasa).toString();
          trasladosTotal = new Decimal(this.utilsService.decimales(new Decimal(trasladosTotal).toString())).add(new Decimal(importe));
        }
        this.traslados.controls[index].get('base')!.setValue(this.utilsService.decimales(base));
        this.traslados.controls[index].get('importe')!.setValue(this.utilsService.decimales(importe));
        index++;
      });

      index = 0;
      this.retenciones.controls.map(control => {
        let tasaOCuota = control.get('tasaOCuota')?.value;
        let importe = new Decimal('0.0').toString();
        let baseTemp = new Decimal('0.0').toString(); 
        if(tasaOCuota !== '' && parseFloat(tasaOCuota) > 0 ){
          baseTemp = base;
          importe = new Decimal(new Decimal(base)).mul(new Decimal(tasaOCuota)).toString()
          retencionesTotal = new Decimal(this.utilsService.decimales(new Decimal(retencionesTotal).toString())).add(new Decimal(importe));
        }
        this.retenciones.controls[index].get('base')!.setValue(baseTemp === '0' ? '0': this.utilsService.decimales(baseTemp));
        this.retenciones.controls[index].get('importe')!.setValue(this.utilsService.decimales(importe));
        index++;
      });
    }
    let total_product = parseFloat(parseFloat((new Decimal(importe).sub(descuento).add(new Decimal(trasladosTotal.toString()))).sub(new Decimal(retencionesTotal.toString())).toString()).toFixed(2));
    
    this.formConcepts.patchValue({total_product, cantidad, valorUnitario, descuento, importe, base});
    console.log(this.formConcepts.value)
  }



  formConceptsReset(): void{
    console.log("resetting");
    this.formConcepts.reset({
      id: Date.now(),
      objetoImp: '01',
      quantity: 0,
      unit_price: 0,
      total_product: 0,
    });
    this.conceptsService.setConcept({
      id: 0,
      claveInterna: "",
      claveProdServ: "",
      noIdentificacion: "",
      cantidad: 0,
      descripcion: "",
      claveUnidad: "",
      unidad: "",
      valorUnitario: 0,
      importe: 0,
      descuento: "",
      objetoImp: "",
      base: "",
      total_product: 0,
      traslados: [],
      retenciones: [],
    });
    this.tittleButton = 'Crear';
    this.idConcept = 0;
  }


}
