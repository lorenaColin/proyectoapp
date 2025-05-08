import { Component, inject } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';
import { MercanciasService } from '../../../../../services/mercancias.service';
import { FormBuilder } from '@angular/forms';
import { MercanciaInterface } from '../../../../../interfaces/mercancias.interface';

@Component({
  selector: 'app-form-mercancias',
  templateUrl: './form-mercancias.component.html',
  styleUrl: './form-mercancias.component.scss'
})
export class FormMercanciasComponent {
private cartaPorteService = inject(CartaPorteService);
 formCartaPorte = this.cartaPorteService.getFormCarta();
 
 mercancias = this.cartaPorteService.getMercanciasFormArray();
   private mercanciaService = inject(MercanciasService);
 
   constructor( private fb: FormBuilder) {
   this.mercancias=this.cartaPorteService.getMercanciasFormArray();
     }
   
  
     ngOnInit(): void {
       this.loadMercancias();
     }
   listMercancias:MercanciaInterface [] = [];
 
   loadMercancias(): void {
     this.mercanciaService.getAllmercancias().subscribe((response) => {
       const { error, data } = response;
       console.log('Datos de mercancias recibidos:', data);
   
       if (!error) {
         this.listMercancias = Array.isArray(data) ? data : [data]; 
       }
     });
   }
   removeMercancia(index: number): void {
    this.mercancias.removeAt(index);
  }
  
}
