import { inject, Injectable, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { productInterface } from '../interfaces/concept';
import Decimal from 'decimal.js';
import { TotalsService } from './totals.service';
import { totalsInterface } from '../interfaces/totals.interface';
@Injectable({
  providedIn: 'root',
})
export class ConceptsService {
  private fb = inject(FormBuilder);
  public totalsService = inject(TotalsService)
  public formulario: FormGroup = {} as FormGroup;
  // productos: FormArray;
  public products = signal<productInterface[]>([]);
  public concepto: productInterface = {} as productInterface;

  constructor() {
    // this.productos = this.fb.array([]);
  }

  // getProductosFormArray(): FormArray {
  //   return this.productos;
  // }

  setForm(formulario: FormGroup){
    console.log("formulario")
    console.log(formulario)
    this.formulario = formulario;
  }

  setDataForm(){
    console.log(this.products())
    console.log(this.formulario.value)
    this.formulario.patchValue({concepts: this.products()});
    console.log(this.formulario.value)
  }
  


  setConcept(data: productInterface) {
    this.concepto = data;
  }

  getConcept() {
    return this.concepto;
  }

  calculateTotals() {
    let subtotal = new Decimal(0.0);
    let descuento = new Decimal(0.0);
    let impuestos = new Decimal(0.0);
    let impuestoRetenidos = new Decimal(0.0);
    let total = new Decimal(0.0);

    this.products().map((element) => {
      let { base, discount, traslados, retenidos } = element;

      subtotal = new Decimal(new Decimal(subtotal).toString()).add(
        new Decimal(base)
      );
      if(discount !== null){
        descuento = new Decimal(new Decimal(descuento).toString()).add(
          new Decimal(discount)
        );
      }

      traslados.forEach(({ importe }) => {
        impuestos = new Decimal(new Decimal(impuestos).toString()).add(
          new Decimal(importe)
        );
      });

      retenidos.forEach(({ importe }) => {
        impuestoRetenidos = new Decimal(
          new Decimal(impuestoRetenidos).toString()
        ).add(new Decimal(importe));
      });
    });

    let totales: totalsInterface = {
      subtotal: parseFloat(subtotal.toString()),
      total: parseFloat(subtotal.toString()),
      descuento: parseFloat(descuento.toString()),
      retenciones: parseFloat(impuestoRetenidos.toString()),
      traslados: parseFloat(impuestos.toString())
    }
    this.totalsService.setValueTotals(totales);

    // total =  parseFloat(((new Decimal(subtotal).sub(descuento).add(new Decimal(impuestos))).sub(new Decimal(impuestoRetenidos)).toString()));
  }
}
