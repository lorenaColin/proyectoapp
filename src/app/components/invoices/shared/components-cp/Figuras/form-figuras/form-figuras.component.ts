import { Component, inject } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';

@Component({
  selector: 'app-form-figuras',
  templateUrl: './form-figuras.component.html',
  styleUrl: './form-figuras.component.scss'
})
export class FormFigurasComponent {
 private cartaPorteService = inject(CartaPorteService);
 formCartaPorte = this.cartaPorteService.getFormCarta();
 remolques = this.cartaPorteService.getFigurasFormArray();
}
