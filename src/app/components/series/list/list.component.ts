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
  @Input() buttonTitle: string = 'Editar';
  
  showLoader = false;
  private seriesServicio = inject(SeriesService);
  serieSeleccionado: SerietInterface = {} as SerietInterface;
  clientes: SerietInterface[] = [];
  filteredSerie: SerietInterface[] = [];
  ngOnInit(): void {
    this.showLoader = true;
    this.seriesServicio.getAllSeries().subscribe((response) => {
      let { error, data } = response;
      console.log(data);
      if (!error) {
        this.series = data;
        this.filteredSerie = [...data];

        console.log(data); 
      }
        console.error('Se esperaba un arreglo, pero se recibió un objeto.');

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
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.series = this.filteredSerie.filter(
      (seguro) =>
        seguro.serie.toLowerCase().includes(filterValue) ||
      seguro.folio.toString().includes(filterValue) ||
        seguro.tipoComprobante?.toLowerCase().includes(filterValue)
    );
  }
}
