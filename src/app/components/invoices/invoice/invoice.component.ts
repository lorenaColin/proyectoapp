import { Component, inject, OnInit } from '@angular/core';
import { FlatpickrDefaultsInterface } from 'angularx-flatpickr';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Spanish } from "flatpickr/dist/l10n/es.js"
import { LISTADOMETODOPAGO, LISTADOFORMAPAGO } from '../../../shared/utils/sat';
import { FormaPagoInterface, MetodoPagoInterface } from '../../../shared/interfaces/shared.interface';
import {Decimal} from 'decimal.js';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {
  public listadoMetodoPago: MetodoPagoInterface[]= LISTADOMETODOPAGO;
  public listadoFormaPago: FormaPagoInterface[] = [];
  private fb =  inject(FormBuilder);
  public myForm: FormGroup = this.fb.group({
    receptor: [, []],
    fecha: [new Date(), []],
    metodoPago: ['', []],
    formaPago: ['', []]
  });


  public datePickerOptions : FlatpickrDefaultsInterface = {
    dateFormat : "Y-m-d",
    locale: Spanish,
    enableTime: false,
    minDate: new Date(new Date().getTime() - (3 * 24 * 60 * 60 * 1000)),
    maxDate: new Date(),
  }
 

  searchFormaPago(): void {
    const{  metodoPago } = this.myForm.value;
    console.log(metodoPago);

    this.listadoFormaPago = [];
    if(metodoPago === "") return;
    this.listadoFormaPago = LISTADOFORMAPAGO.filter(forma => forma.metodoPago === metodoPago);
  }

  ngOnInit() {

    let x = new Decimal(123.4567)
    console.log(x);

    // flatpickrLanguage
    // console.log(new Date())
    // console.log(new Date(new Date().getDay() - 3))
    // Your other logic here...
  } 
}
