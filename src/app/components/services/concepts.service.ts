import { inject, Injectable, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { productInterface } from '../interfaces/concept';
import Decimal from 'decimal.js';
import { TotalsService } from './totals.service';
@Injectable({
  providedIn: 'root',
})
export class ConceptsService {
  private fb = inject(FormBuilder);
  public totalsService = inject(TotalsService)

  productos: FormArray;
  public products = signal<productInterface[]>([
    {
      id: 1,
      name_product: '123',
      product_service_code: 'daniel11',
      description: '12121212',
      quantity: 0,
      unit_value: '123',
      unit_price: 0,
      unit_key: '123',
      discount: 0,
      valorUnitario: 0,
      base: 0,
      total_product: 0,
      tax_object: '01',
      traslados: [],
      retenidos: [],
    },
    // {
    //   "id": 2,
    //   "name_product": "22222",
    //   "product_service_code": "2222",
    //   "description": "222",
    //   "quantity": 0,
    //   "unit_value": "22",
    //   "unit_price": 0,
    //   "unit_key": "222",
    //   "discount": 0,
    //   "valorUnitario": 0,
    //   "total_product": 0,
    //   "tax_object": "01",
    //   "traslados": [],
    //   "retenidos": []
    // },
    {
      id: 1743445751704,
      name_product: '1',
      product_service_code: 'hola1234',
      description: '1515',
      quantity: 39.79,
      unit_value: '1',
      unit_price: 829.932143,
      unit_key: '',
      discount: 0,
      valorUnitario: 33022.99996997,
      base: 33022.99996997,
      total_product: 36572.972467540574,
      tax_object: '02',
      traslados: [
        {
          base: 33022.99996997,
          descripcion: 'IVA',
          impuesto: '002',
          tasaOCuota: '0.160000',
          importe: 5283.6799951952,
        },
      ],
      retenidos: [
        {
          base: 33022.99996997,
          descripcion: 'R.IVA',
          impuesto: '002',
          tasaOCuota: 0.04,
          importe: 1320.9199987988,
        },
        {
          base: 33022.99996997,
          descripcion: 'R. ISR',
          impuesto: '001',
          tasaOCuota: 0.0125,
          importe: 412.787499624625,
        },
      ],
    },
  ]);
  public concepto: productInterface = {} as productInterface;

  constructor() {
    this.productos = this.fb.array([]);
  }

  getProductosFormArray(): FormArray {
    return this.productos;
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

    let formulario  = this.totalsService.getFormTotals();
    formulario.patchValue({
      subtotal: parseFloat(subtotal.toString()),
      total: parseFloat(subtotal.toString()),
      descuento: parseFloat(descuento.toString()),
      retenciones: parseFloat(impuestoRetenidos.toString()),
      traslados: parseFloat(impuestos.toString())
    })

    // total =  parseFloat(((new Decimal(subtotal).sub(descuento).add(new Decimal(impuestos))).sub(new Decimal(impuestoRetenidos)).toString()));
  }
}
