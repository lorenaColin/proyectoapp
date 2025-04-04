import { inject, Injectable, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { productInterface } from '../interfaces/concept';
import Decimal from 'decimal.js';
import { TotalsService } from './totals.service';
import { totalsInterface } from '../interfaces/totals.interface';
import { UtilsService } from '../../shared/services/utils.service';
@Injectable({
  providedIn: 'root',
})
export class ConceptsService {
  private fb = inject(FormBuilder);
  public totalsService = inject(TotalsService)
  public utilsService = inject(UtilsService)
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
    this.formulario = formulario;
  }

  setDataForm(){
    this.formulario.patchValue({concepts: this.products()});
  }
  


  setConcept(data: productInterface) {
    this.concepto = data;
  }

  getConcept() {
    return this.concepto;
  }
  getConcepts(): productInterface[] {
    return this.products();
  }
  

  calculateTotals() {
    let subtotal = new Decimal(0.0);
    let descuento = new Decimal(0.0);
    let impuestos = new Decimal(0.0);
    let impuestoRetenidos = new Decimal(0.0);
    // let total:number = parseFloat(new Decimal(0.0).toString());

    this.products().map((element) => {
      let { importe, descuento:descuntoTemp, traslados, retenciones } = element;

      subtotal = new Decimal(new Decimal(subtotal).toString()).add(
        new Decimal(importe)
      );
      if(descuntoTemp !== null){
        descuento = new Decimal(new Decimal(descuento).toString()).add(new Decimal(descuntoTemp));
      }

      traslados.forEach(({ importe }) => {
        impuestos = new Decimal(new Decimal(impuestos).toString()).add(
          new Decimal(importe)
        );
      });

      retenciones.forEach(({ importe }) => {
        impuestoRetenidos = new Decimal(
          new Decimal(impuestoRetenidos).toString()
        ).add(new Decimal(importe));
      });
    });

    let totales: totalsInterface = {
      subtotal: this.utilsService.decimales((parseFloat(subtotal.toString()).toFixed(2)), 2),
      total: this.utilsService.decimales((new Decimal(parseFloat(subtotal.toString()).toFixed(2)).sub(parseFloat(descuento.toString()).toFixed(2)).add(parseFloat(impuestos.toString()).toFixed(2))).sub(parseFloat(impuestoRetenidos.toString()).toFixed(2)).toString(), 2),
      descuento: this.utilsService.decimales((parseFloat(descuento.toString()).toFixed(2)), 2),
      retenciones: this.utilsService.decimales((parseFloat(impuestoRetenidos.toString()).toFixed(2)), 2),
      traslados: this.utilsService.decimales((parseFloat(impuestos.toString()).toFixed(2)), 2)
    }
    this.totalsService.setValueTotals(totales);

  }
}
