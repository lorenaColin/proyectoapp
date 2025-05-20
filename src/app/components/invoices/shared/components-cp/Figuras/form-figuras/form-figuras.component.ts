import { Component, inject } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';
import { figurasService } from '../../../../../services/figuras.service';
import { FormArray, FormBuilder } from '@angular/forms';
import { FigurasInterface } from '../../../../../interfaces/figuras.interface';
import { MercanciasService } from '../../../../../services/mercancias.service';

@Component({
  selector: 'app-form-figuras',
  templateUrl: './form-figuras.component.html',
  styleUrl: './form-figuras.component.scss'
})
export class FormFigurasComponent {
 private cartaPorteService = inject(CartaPorteService);
  formCartaPorte = this.cartaPorteService.getFormCarta();
  
  figuras = this.cartaPorteService.getFigurasFormArray();
    private figurasService = inject(figurasService);
  
    constructor( private fb: FormBuilder) {
    this.figuras=this.cartaPorteService.getFigurasFormArray();
      }
    
   
      ngOnInit(): void {
        this.loadFiguras();
      }
    listfiguras:FigurasInterface [] = [];
  
    loadFiguras(): void {
      this.figurasService.getAllFiguras().subscribe((response) => {
        const { error, data } = response;
        console.log('Datos de mercancias recibidos:', data);
    
        if (!error) {
          this.listfiguras = Array.isArray(data) ? data : [data]; 
        }
      });
    }
    removeFigura(index: number): void {
     this.figuras.removeAt(index);
   }
    ngOnDestroy(): void {
    // 🔴 Limpiar el FormArray al salir del componente
    while (this.figuras.length !== 0) {
      this.figuras.removeAt(0);
    }
  }

}
