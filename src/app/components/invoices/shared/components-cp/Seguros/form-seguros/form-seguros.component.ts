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

  // loadSeguros(): void {
  //   this.seguroService.getInsurance().subscribe((response) => {
  //     const { error, data } = response;
  //     if (!error) {
  //       this.listSeguros = data;
  
  //       this.segurosAmbientales = this.listSeguros.filter(seguro => seguro.type === 'Ambiental');
  //       this.segurosCarga = this.listSeguros.filter(seguro => seguro.type === 'Carga');
  //     }
  //   });
  // }

loadSeguros(): void {
  const companyUuid = this.getCompanyUuid();
  console.log('UUID de empresa:', companyUuid);

  if (!companyUuid) {
    console.warn('UUID de empresa no encontrado en localStorage');
    return;
  }

  this.seguroService.getInsurance().subscribe((response) => {
    const { error, data } = response;

    if (!error && data) {
      // Debug de todos los seguros carga
      console.log('Seguros Carga sin filtrar:', data.filter(seguro => seguro.type === 'Carga'));
      console.log('Seguros Carga con company_id:', data.filter(seguro => seguro.type === 'Carga' && String(seguro.company_id) === String(companyUuid)));

      this.listSeguros = data.filter(
        (seguro: InsuranceInterface) => String(seguro.company_id) === String(companyUuid)
      );

      this.segurosAmbientales = this.listSeguros.filter(
        (seguro) => seguro.type.toLowerCase() === 'ambiental'
      );

      this.segurosCarga = this.listSeguros.filter(
        (seguro) => seguro.type.toLowerCase() === 'carga'
      );

      console.log('Seguros Ambientales filtrados:', this.segurosAmbientales);
      console.log('Seguros Carga filtrados:', this.segurosCarga);
    }
  });
}

  cargarSeguroCarga(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
  
    // Si el valor seleccionado no es vacío
    if (selectedId) {
      const selectedSeguro = this.segurosCarga.find(
        (seguro) => seguro.id.toString() === selectedId // Comparar como cadenas
      );
  
      if (selectedSeguro) {
        this.formSeguros.patchValue({
          sCarge: selectedSeguro.id, // Asignar el ID del seguro seleccionado
        });
      }
    } else {
      // Si no se seleccionó un valor, limpiar el valor de sCarge
      this.formSeguros.patchValue({ sCarge: null });
    }
  }
  
  
  onAmbientSelected(event: Event): void {
    const selectedAsegure = (event.target as HTMLSelectElement).value;
  
    const selectedSeguro = this.segurosAmbientales.find(
      (seguro) => seguro.asegure === selectedAsegure
    );
  
    if (selectedSeguro) {
      this.formSeguros.patchValue({
        pSeguro: selectedSeguro.polize,
      });
    } else {
      this.formSeguros.patchValue({
        pSeguro: null,
      });
    }
  }
   private getCompanyUuid(): string | null {
  return localStorage.getItem('company');
}

}
