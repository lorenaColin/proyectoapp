import { Component, inject, Input } from '@angular/core';
import { remolquesInterface, remolquesResponseInterface } from '../../../../interfaces/remolques.interface';
import { remolquesService } from '../../../../services/remolques.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-remolques',
  templateUrl: './list-remolques.component.html',
  styleUrl: './list-remolques.component.scss'
})
export class ListRemolquesComponent {
  remolques: remolquesInterface[] = [];
  @Input() remolque: remolquesInterface = {} as remolquesInterface;
  @Input() buttonTitle: string = 'Editar';
  showLoader = false;
  private remolquesServicio = inject(remolquesService);
  serieSeleccionado: remolquesInterface = {} as remolquesInterface;

  ngOnInit(): void {
    this.showLoader = true;
    this.remolquesServicio.getAllRemolques().subscribe((response) => {
      let { error, data } = response;
      console.log(data);
      if (!error) {
        this.remolques = data;
        console.log(data); 
      }
      this.showLoader = false;
    });
  }
    editRemolques(id: number): void {
      this.showLoader = true;
      console.log("ID que se pasa al backend:", id);
      this.remolquesServicio.getRemolquesById(id).subscribe({
        next: (response) => {
          this.remolque = response.data;
          console.log(this.remolque);
          this.showLoader = false;
        },
        error: (err) => {
          console.error('Error al obtener el remolque:', err);
          Swal.fire({
            title: 'Error al obtener el remolque',
            text: err.message || 'Error desconocido',
            icon: 'error',
          });
          this.showLoader = false;
        },
        
      });
    }
 responseRemolque(response: remolquesInterface): void {
    const adaptedResponse: remolquesResponseInterface = {
      message: response.placa ? 'Serie procesada' : 'Error al procesar la serie',
      statusCode: response.SubTipoRem ? 200 : 500,
      error: !response.id,
      data: response
    };
  
    const { message, data, error } = adaptedResponse;
  
    if (error) {
      Swal.fire({
        title: data.placa || data.SubTipoRem|| 'Error desconocido',
        icon: 'error',
      });
      return;
    }
  
    const indice = this.remolques.findIndex((remolques) => remolques.id === data.id);
    if (indice !== -1) {
      this.remolques[indice] = data;
      Swal.fire({
        title: 'Remolque actualizado exitosamente',
        icon: 'success',
      });
    } else {
      this.remolques.push(data);
      Swal.fire({
        title: 'remolque creado exitosamente',
        icon: 'success',
      });
    }
  }
}
