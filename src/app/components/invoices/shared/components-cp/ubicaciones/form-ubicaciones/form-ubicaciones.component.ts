import { Component, inject } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';

@Component({
  selector: 'app-form-ubicaciones',
  templateUrl: './form-ubicaciones.component.html',
  styleUrl: './form-ubicaciones.component.scss'
})
export class FormUbicacionesComponent {
 private cartaPorteService = inject(CartaPorteService);
 formCartaPorte = this.cartaPorteService.getFormCarta();
  ubicaciones = this.cartaPorteService.getUbicacionesFormArray();
  
}
