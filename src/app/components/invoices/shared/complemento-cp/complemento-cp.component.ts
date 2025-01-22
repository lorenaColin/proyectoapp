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

  // public formCartaPorte = this.cartaPorteService.getFormCarta();
}
