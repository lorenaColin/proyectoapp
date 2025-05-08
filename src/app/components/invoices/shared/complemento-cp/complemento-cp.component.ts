import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CartaPorteService } from '../../../services/carta-porte.service';

@Component({
  selector: 'app-complemento-cp',
  templateUrl: './complemento-cp.component.html',
  styleUrl: './complemento-cp.component.scss'
})
export class ComplementoCpComponent {
  
  private fb = inject(FormBuilder);
  private cartaPorteService = inject(CartaPorteService);
  formCartaPorte = this.cartaPorteService.getFormCarta();
  
  constructor() {
    this.formCartaPorte = this.cartaPorteService.getFormCarta();


  this.formCartaPorte.get('selectIstmo')?.valueChanges.subscribe(value => {
    if (value === 'No') {
      this.formCartaPorte.get('uPoloOrigen')?.disable();
      this.formCartaPorte.get('uPoloDestino')?.disable();
    } else {
      this.formCartaPorte.get('uPoloOrigen')?.enable();
      this.formCartaPorte.get('uPoloDestino')?.enable();
    }
  });
  }
  
}
