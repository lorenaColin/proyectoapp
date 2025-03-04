import { Component, inject } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';

@Component({
  selector: 'app-form-seguros',
  templateUrl: './form-seguros.component.html',
  styleUrl: './form-seguros.component.scss'
})
export class FormSegurosComponent {
   private cartaPorteService = inject(CartaPorteService);
   formSeguros = this.cartaPorteService.getseguros();
 
  
}
