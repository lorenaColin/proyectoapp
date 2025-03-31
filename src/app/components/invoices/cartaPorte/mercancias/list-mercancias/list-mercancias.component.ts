import { Component, inject, Input } from '@angular/core';
import { MercanciasService } from '../../../../services/mercancias.service';
import { MercanciaInterface, MercanciaResponseInterface } from '../../../../interfaces/mercancias.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-mercancias',
  templateUrl: './list-mercancias.component.html',
  styleUrl: './list-mercancias.component.scss'
})
export class ListMercanciasComponent {
private mercanciaService = inject(MercanciasService);
mercancias: MercanciaInterface[] = [];
public filteredMercancia: MercanciaInterface[] = [];
@Input() mercancia: MercanciaInterface = {} as MercanciaInterface;
@Input() buttonTitle: string = 'Editar';
showLoader = false;
mercanciaSeleccionada: MercanciaInterface = {} as MercanciaInterface;

ngOnInit(): void {
  this.showLoader = true;
  this.mercanciaService.getAllmercancias().subscribe((response) => {
    let { error, data } = response;
    console.log(data);
    if (!error) {
      if (Array.isArray(data)) {
        this.mercancias = data;
        this.filteredMercancia = response.data;
      } else {
        console.error('Se esperaba un arreglo, pero se recibió un objeto.');
      }
      console.log(data);
    }
    this.showLoader = false;
  });
}


editMercancia(id: number): void {
    this.showLoader = true;
    console.log("ID que se pasa al backend:", id);
    this.mercanciaService.getmercanciasById(id).subscribe({
      next: (response) => {
        this.mercancia = response.data;
        console.log(this.mercancia);
        
        this.showLoader = false;
        
      },
      error: (err) => {
        console.error('Error al obtener la mercancia:', err);
        Swal.fire({
          title: 'Error al obtener la mercancia',
          text: err.message || 'Error desconocido',
          icon: 'error',
        });
        this.showLoader = false;
      },

    });
  }
responseMercancia(response: MercanciaInterface): void {
    const adaptedResponse: MercanciaResponseInterface = {
      message: response.claveProdServCP? 'Serie procesada' : 'Error al procesar la serie',
      statusCode: response.id ? 200 : 500,
      error: !response.descripcion,
      data: response
    };

    const { message, data, error } = adaptedResponse;

    if (error) {
      Swal.fire({
        title: data.claveProdServCP || data.claveUnidad || 'Error desconocido',
        icon: 'error',
      });
      return;
    }

    const indice = this.mercancias.findIndex((ubi) => ubi.id === data.id);
    if (indice !== -1) {
      this.mercancias[indice] = data;
      Swal.fire({
        title: 'Mercancia actualizada exitosamente',
        icon: 'success',
      });
    } else {
      // Serie es nueva, se agrega
      this.mercancias.push(data);
      Swal.fire({
        title: 'Mercancia creada exitosamente',
        icon: 'success',
      });
    }
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.mercancias = this.filteredMercancia.filter(
      (seguro) =>
        seguro.claveProdServCP.toLowerCase().includes(filterValue) ||
        seguro.unidad.toLowerCase().includes(filterValue) ||
        seguro.descripcion.toLowerCase().includes(filterValue)
    );
  }
}
