import { Component, inject } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';

@Component({
  selector: 'app-form-mercancias',
  templateUrl: './form-mercancias.component.html',
  styleUrl: './form-mercancias.component.scss'
})
export class FormMercanciasComponent {
private cartaPorteService = inject(CartaPorteService);
 formCartaPorte = this.cartaPorteService.getFormCarta();
 mercancias = this.cartaPorteService.getMercanciasFormArray();
}
