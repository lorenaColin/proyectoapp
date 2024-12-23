import { Component, inject, OnInit } from '@angular/core';
import { flatpickrLanguage } from '../../../shared/utils/utils';
import { FlatpickrDefaultsInterface } from 'angularx-flatpickr';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {

  private fb =  inject(FormBuilder);
  keyword = 'name';
  public countries = [
    {
      id: 1,
      name: 'Albania',
    },
    {
      id: 2,
      name: 'Belgium',
    },
    {
      id: 3,
      name: 'Denmark',
    },
    {
      id: 4,
      name: 'Montenegro',
    },
    {
      id: 5,
      name: 'Turkey',
    },
    {
      id: 6,
      name: 'Ukraine',
    },
    {
      id: 7,
      name: 'Macedonia',
    },
    {
      id: 8,
      name: 'Slovenia',
    },
    {
      id: 9,
      name: 'Georgia',
    },
    {
      id: 10,
      name: 'India',
    },
    {
      id: 11,
      name: 'Russia',
    },
    {
      id: 12,
      name: 'Switzerland',
    }
  ];



  selectEvent(item:any) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  
  onFocused(e:any){
    // do something when input is focused
  }


  public myForm: FormGroup = this.fb.group({
    receptor: [, []],
    fecha: [new Date(), []],

  });


  public datePickerOptions : FlatpickrDefaultsInterface = {
    mode : 'single',
    dateFormat : "Y-m-d",
    locale: flatpickrLanguage,
    enableTime: false,
    minDate: new Date(new Date().getTime() - (3 * 24 * 60 * 60 * 1000)),
    maxDate: new Date(),
    now: "2024-12-19",
  }
 

  ngOnInit() {

    

    // flatpickrLanguage
    // console.log(new Date())
    // console.log(new Date(new Date().getDay() - 3))
    // Your other logic here...
  } 
}
