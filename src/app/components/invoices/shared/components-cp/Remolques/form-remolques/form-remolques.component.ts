import { Component, inject } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';
import { remolquesInterface } from '../../../../../interfaces/remolques.interface';
import { remolquesService } from '../../../../../services/remolques.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-form-Remolques',
  templateUrl: './form-remolques.component.html',
  styleUrl: './form-remolques.component.scss'
})
export class FormRemolquesComponent {
    private cartaPorteService = inject(CartaPorteService);
  formRemolques = this.cartaPorteService.getRemolques();
  private remolqueService = inject(remolquesService);

 constructor( private fb: FormBuilder) {
this.formRemolques=this.cartaPorteService.getRemolques();
  }
  listRemolque:remolquesInterface [] = [];

  ngOnInit(): void {
    this.loadTrasporte();
  }
  // loadTrasporte(): void {

  //   this.remolqueService.getAllRemolques().subscribe((response) => {
  //     const { error, data } = response;
  //     console.log('Datos remolque recibidos:', data);
  //     (!error) ? this.listRemolque = data : '';
  //   });
  // }
loadTrasporte(): void {
  const companyUuid = this.getCompanyUuid();

  if (!companyUuid) {
    console.warn('UUID de empresa no encontrado en localStorage');
    return;
  }

  this.remolqueService.getAllRemolques().subscribe((response) => {
    const { error, data } = response;
    console.log('Datos remolque recibidos:', data);

    if (!error && data) {
      this.listRemolque = data.filter(
        (remolque: remolquesInterface) => remolque.uuid_company === companyUuid
      );
      console.log('Remolques filtrados por empresa:', this.listRemolque);
    }
  });
}


   selectedremolque: remolquesInterface | null = null;
  
   cargarRemolque(event: Event, field: 'sAmbientr' | 'sAmbient1'): void {
    const selectedId = +(event.target as HTMLSelectElement).value;
  
    if (selectedId) {
      const selectedRemolque = this.listRemolque.find(
        (remolque) => remolque.id === selectedId
      ) || null;
  
      if (selectedRemolque) {
        this.formRemolques.patchValue({
          [field]: selectedRemolque.id,
          placaRem: field === 'sAmbientr' ? selectedRemolque.placa : this.formRemolques.value.placaRem,
          placaRem1: field === 'sAmbient1' ? selectedRemolque.placa : this.formRemolques.value.placaRem1,
        });
      }
    } else {
      this.formRemolques.patchValue({
        placaRem1: "",  
      sAmbient1: "",

      });
    }
  }
  
  private getCompanyUuid(): string | null {
  return localStorage.getItem('company');
}

}
