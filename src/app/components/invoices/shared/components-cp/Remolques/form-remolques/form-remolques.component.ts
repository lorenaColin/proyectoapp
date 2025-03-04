import { Component, inject } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';

@Component({
  selector: 'app-form-Remolques',
  templateUrl: './form-remolques.component.html',
  styleUrl: './form-remolques.component.scss'
})
export class FormRemolquesComponent {
    private cartaPorteService = inject(CartaPorteService);
  formRemolques = this.cartaPorteService.getRemolques();

}
