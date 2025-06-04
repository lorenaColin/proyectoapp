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

  // ngOnInit(): void {
  //   this.showLoader = true;
  //   this.autotransportService.getAutotransports().subscribe((response) => {
  //     this.showLoader = false;
  //     this.listadoAutos = response.data;
  //     this.filteredAutotransports = response.data;

  //     let { error, data } = response;
  //     if (error) return console.error('Error al obtener las empresas');
  //     this.listadoAutos = data;
  //   });
  // }
  ngOnInit(): void {
  this.showLoader = true;
  this.autotransportService.getAutotransports().subscribe((response) => {
    this.showLoader = false;

    const { error, data } = response;

    if (error) {
      console.error('Error al obtener los autotransportes');
      this.listadoAutos = [];
      this.filteredAutotransports = [];
      return;
    }

    if (Array.isArray(data)) {
      const uuid = this.getCompanyUuid();

      if (uuid) {
        this.listadoAutos = data.filter(auto => auto.company_id === uuid);
      } else {
        this.listadoAutos = [];
      }

      this.filteredAutotransports = [...this.listadoAutos];
    } else {
      console.error('Se esperaba un arreglo, pero se recibió:', data);
      this.listadoAutos = [];
      this.filteredAutotransports = [];
    }
  });
}

private getCompanyUuid(): string | null {
  return localStorage.getItem('company');
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
      const errorText =
      data?.placaVM?.[0] ||
      data?.configVehicular?.[0] ||
      data?.aseguraRespCivil?.[0] ||
      data?.permSCT?.[0] ||
      data?.numPermisoSCT?.[0] ||
      data?.polizaRespCivil?.[0] ||
      data?.anioModeloVM?.[0] || 
      data?.pesoBrutoVehicular?.[0] ||
      'Error desconocido.';
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

  // refreshAutotransportList(): void {
  //   this.showLoader = true;
  //   this.autotransportService.getAutotransports().subscribe(
  //     (response) => {
  //       this.listadoAutos = response.data;
  //       this.filteredAutotransports = response.data;
  //       this.showLoader = false;
  //     },
  //     () => {
  //       this.showLoader = false;
  //       Swal.fire(
  //         'Error',
  //         'No se pudo actualizar la lista de autotransportes.',
  //         'error'
  //       );
  //     }
  //   );
  // }
refreshAutotransportList(): void {
  this.showLoader = true;
  this.autotransportService.getAutotransports().subscribe(
    (response) => {
      const { error, data } = response;
      const uuid = this.getCompanyUuid();

      if (!error && Array.isArray(data) && uuid) {
        this.listadoAutos = data.filter(auto => auto.company_id === uuid);
        this.filteredAutotransports = [...this.listadoAutos];
      } else {
        this.listadoAutos = [];
        this.filteredAutotransports = [];
        console.error('Error al filtrar autotransportes por company_id');
      }

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
