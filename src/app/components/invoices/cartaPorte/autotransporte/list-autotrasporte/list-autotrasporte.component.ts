import { Component, inject, Input } from '@angular/core';
import {
  AutotransportInterface,
  AutotransportListInterface,
  AutotransportResponseInterface,
} from '../../../../interfaces/autotransport.interface';
import { AutotransportService } from '../../../../services/autotransport.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-autotrasporte',
  templateUrl: './list-autotrasporte.component.html',
  styleUrl: './list-autotrasporte.component.scss',
})
export class ListAutotrasporteComponent {
  showLoader = false;
  public listadoAutos: AutotransportInterface[] = [];
  private autotransportService = inject(AutotransportService);
  filteredAutotransports: any[] = [];
  @Input() auto: AutotransportInterface = {} as AutotransportInterface;

  ngOnInit(): void {
    this.showLoader = true;
    this.autotransportService.getAutotransports().subscribe((response) => {
      this.showLoader = false;
      this.listadoAutos = response.data;
      this.filteredAutotransports = response.data;

      let { error, data } = response;
      if (error) return console.error('Error al obtener las empresas');
      this.listadoAutos = data;
    });
  }

  editAutotransport(id: number): void {
    this.showLoader = true;
    this.autotransportService.getAutotransportById(id).subscribe((response) => {
      this.auto = response.data;
      console.log(this.auto);
      this.showLoader = false;
    });
  }

  responseAutotransport(response: AutotransportResponseInterface): void {
    const { message, error, data } = response;
    this.showLoader = true;
    if (message === 'Validation errors') {
      this.showLoader = false;
      const errorText = data?.placaVM?.[0] || 'Error desconocido.';
      Swal.fire({
        title: 'Error de validación',
        text: errorText,
        icon: 'error',
      });
      return;
    } else {
      this.showLoader = false;
      Swal.fire({
        title: 'Operación exitosa',
        text: message,
        icon: 'success',
      });
      this.refreshAutotransportList();
    }
  }

  refreshAutotransportList(): void {
    this.showLoader = true;
    this.autotransportService.getAutotransports().subscribe(
      (response) => {
        this.listadoAutos = response.data;
        this.filteredAutotransports = response.data;
        this.showLoader = false;
      },
      () => {
        this.showLoader = false;
        Swal.fire(
          'Error',
          'No se pudo actualizar la lista de autotransportes.',
          'error'
        );
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.filteredAutotransports = this.listadoAutos.filter(
      (auto) =>
        auto.placaVM.toLowerCase().includes(filterValue) ||
        auto.aseguraRespCivil.toLowerCase().includes(filterValue) ||
        auto.configVehicular.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredAutotransports);
  }
}
