import { Component, inject, Input } from '@angular/core';
import { SerietInterface, SerietResponseInterface } from '../../interfaces/series.interface';
import {SeriesService } from '../../services/serie.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  series: SerietInterface[] = [];
  @Input() serie: SerietInterface = {} as SerietInterface;
  @Input() buttonTitle: string = 'Crear';
  showLoader = false;
  private seriesServicio = inject(SeriesService);
  serieSeleccionado: SerietInterface = {} as SerietInterface;
  clientes: SerietInterface[] = [];

  ngOnInit(): void {
    this.showLoader = true;
    this.seriesServicio.getAllSeries().subscribe((response) => {
      let { error, data } = response;
      console.log(data);
      if (!error) {
        this.series = data;
        console.log(data); 
      }
      this.showLoader = false;
    });
  }

  editCustomer(id: number): void {
    this.showLoader = true;
    console.log("ID que se pasa al backend:", id);
    this.seriesServicio.getSeriesById(id).subscribe({
      next: (response) => {
        this.serie = response.data;
        status: response.data.status === 'Activo',
        console.log(this.serie);
        this.showLoader = false;
      },
      error: (err) => {
        console.error('Error al obtener la serie:', err);
        Swal.fire({
          title: 'Error al obtener la serie',
          text: err.message || 'Error desconocido',
          icon: 'error',
        });
        this.showLoader = false;
      },
      
    });
  }
  responseSerie(response: SerietInterface): void {
    const adaptedResponse: SerietResponseInterface = {
      message: response.folio ? 'Serie procesada' : 'Error al procesar la serie',
      statusCode: response.folio ? 200 : 500,
      error: !response.folio,
      data: response
    };
  
    const { message, data, error } = adaptedResponse;
  
    if (error) {
      Swal.fire({
        title: data.folio || data.tipoComprobante || 'Error desconocido',
        icon: 'error',
      });
      return;
    }
  
    const indice = this.series.findIndex((serie) => serie.id === data.id);
    if (indice !== -1) {
      this.series[indice] = data;
      Swal.fire({
        title: 'Serie actualizada exitosamente',
        icon: 'success',
      });
    } else {
      // Serie es nueva, se agrega
      this.series.push(data);
      Swal.fire({
        title: 'Serie creada exitosamente',
        icon: 'success',
      });
    }
  }
  
  // responseSerie(response: SerietInterface): void {
  //   const adaptedResponse: SerietResponseInterface = {
  //     message: response.folio ? 'Serie procesada' : 'Error al procesar la serie',
  //     statusCode: response.folio ? 200 : 500,
  //     error: !response.folio,
  //     data: response
  //   };
  
  //   const { message, data, error } = adaptedResponse;
  
  //   if (error) {
  //     Swal.fire({
  //       title: data.folio || data.tipoComprobante || 'Error desconocido',
  //       icon: 'error',
  //     });
  //     return;
  //   }
  
  //   Swal.fire({
  //     title: message,
  //     icon: 'success',
  //   });
  
  //   const indice = this.series.findIndex((customer) => customer.id === data.id);
  //   if (indice !== -1) {
  //     this.series[indice] = data;
  //   } else {
  //     this.series.push(data);
  //   }
  // }
  
  
  
}
