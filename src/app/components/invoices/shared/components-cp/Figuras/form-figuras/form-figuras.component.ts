import { Component, inject } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';
import { figurasService } from '../../../../../services/figuras.service';
import { FormBuilder } from '@angular/forms';
import { FigurasInterface } from '../../../../../interfaces/figuras.interface';

@Component({
  selector: 'app-form-figuras',
  templateUrl: './form-figuras.component.html',
  styleUrl: './form-figuras.component.scss'
})
export class FormFigurasComponent {
 private cartaPorteService = inject(CartaPorteService);
 formCartaPorte = this.cartaPorteService.getFormCarta();  
 remolques = this.cartaPorteService.getFigurasFormArray();
    private figurasService = inject(figurasService);
  
    constructor( private fb: FormBuilder) {
    this.remolques=this.cartaPorteService.getFigurasFormArray();
      }
    
      ngOnInit(): void {
        this.loadFiguras();
      }
    listFiguras:FigurasInterface [] = [];
  
    loadFiguras(): void {
      this.figurasService.getAllFiguras().subscribe((response) => {
        const { error, data } = response;
        console.log('Datos de figuras recibidos:', data);
    
        if (!error) {
          this.listFiguras = Array.isArray(data) ? data : [data]; 
        }
      });
    }
}
