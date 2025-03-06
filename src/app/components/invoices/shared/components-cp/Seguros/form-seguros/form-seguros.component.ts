import { Component, inject } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';
import { InsuranceService } from '../../../../../services/insurance.service';
import { FormBuilder } from '@angular/forms';
import { InsuranceInterface } from '../../../../../interfaces/insurance.interface';

@Component({
  selector: 'app-form-seguros',
  templateUrl: './form-seguros.component.html',
  styleUrl: './form-seguros.component.scss'
})
export class FormSegurosComponent {
  listSeguros:InsuranceInterface [] = [];
  segurosAmbientales: any[] = [];
  segurosCarga: any[] = [];
   private cartaPorteService = inject(CartaPorteService);
   formSeguros = this.cartaPorteService.getseguros();
   private seguroService = inject(InsuranceService);
 
  constructor( private fb: FormBuilder) {
 this.formSeguros=this.cartaPorteService.getseguros();
   }
 
   ngOnInit(): void {
     this.loadSeguros();
   }

  loadSeguros(): void {
    this.seguroService.getInsurance().subscribe((response) => {
      const { error, data } = response;
      if (!error) {
        this.listSeguros = data;
  
        this.segurosAmbientales = this.listSeguros.filter(seguro => seguro.type === 'Ambiental');
        this.segurosCarga = this.listSeguros.filter(seguro => seguro.type === 'Carga');
      }
    });
  }


  cargarSeguroCarga(event: Event): void {
    const selectedId = +(event.target as HTMLSelectElement).value;
  
    if (selectedId) {
      const selectedSeguro = this.segurosCarga.find(
        (seguro) => seguro.id === selectedId
      ) || null;
  
      if (selectedSeguro) {
        this.formSeguros.patchValue({
          sCarge: selectedSeguro.id,
        });
      }
    } else {
      this.formSeguros.patchValue({ sCarge: null }); 
    }
  }
  
  
}
