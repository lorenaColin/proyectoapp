import { Component, inject } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';
import { ubicacionesService } from '../../../../../services/ubicaciones.service';
import { FormBuilder } from '@angular/forms';
import { ubicacionInterface } from '../../../../../interfaces/ubicaciones.interface';

@Component({
  selector: 'app-form-ubicaciones',
  templateUrl: './form-ubicaciones.component.html',
  styleUrl: './form-ubicaciones.component.scss'
})
export class FormUbicacionesComponent {
 private cartaPorteService = inject(CartaPorteService);
 formCartaPorte = this.cartaPorteService.getFormCarta();
  ubicaciones = this.cartaPorteService.getUbicacionesFormArray();
  private ubicacioneService = inject(ubicacionesService);

  constructor( private fb: FormBuilder) {
  this.ubicaciones=this.cartaPorteService.getUbicacionesFormArray();
    }
  
    ngOnInit(): void {
      this.loadubicacion();
    }
  listUbicaciones:ubicacionInterface [] = [];

  loadubicacion(): void {
    this.ubicacioneService.getAllubicacion().subscribe((response) => {
      const { error, data } = response;
      console.log('Datos de ubicaciones recibidos:', data);
  
      if (!error) {
        this.listUbicaciones = Array.isArray(data) ? data : [data]; 
      }
    });
  }
  
}
