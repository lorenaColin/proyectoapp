import { Component, inject, Input } from '@angular/core';
import { InsuranceService } from '../../../../services/insurance.service';
import { InsuranceInterface, InsuranceResponseInterface } from '../../../../interfaces/insurance.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-seguros',
  templateUrl: './list-seguros.component.html',
  styleUrl: './list-seguros.component.scss',
})
export class ListSegurosComponent {
  showLoader = false;
  public listadoSeguros: InsuranceInterface[] = [];
  private insuranceService = inject(InsuranceService);
  filteredInsurances: any[] = [];
  @Input() seguro: InsuranceInterface = {} as InsuranceInterface;

  ngOnInit(): void {
    this.showLoader = true;
    this.insuranceService.getInsurance().subscribe((response) => {
      this.showLoader = false;
      this.listadoSeguros = response.data;
      this.filteredInsurances = response.data;

      let { error, data } = response;
      if (error) return console.error('Error al obtener las empresas');
      this.listadoSeguros = data;
    });
  }

  responseInsurance(response: InsuranceResponseInterface): void {
      const { message, error, data } = response;
      this.showLoader = true;
      if (message === 'Validation errors') {
        this.showLoader = false;
        const errorText = data?.type?.[0] || 'Error desconocido.';
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
        this.refreshInsuranceList();
      }
    }
  
    refreshInsuranceList(): void {
      this.showLoader = true;
      this.insuranceService.getInsurance().subscribe(
        (response) => {
          this.listadoSeguros = response.data;
          this.filteredInsurances = response.data;
          this.showLoader = false;
        },
        () => {
          this.showLoader = false;
          Swal.fire(
            'Error',
            'No se pudo actualizar la lista de seguros.',
            'error'
          );
        }
      );
    }
    editInsurance(id: number): void {
    this.showLoader = true;
    this.insuranceService.getInsuranceById(id).subscribe((response) => {
      this.seguro = response.data;
      console.log(this.seguro);
      this.showLoader = false;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.filteredInsurances = this.listadoSeguros.filter(
      (seguro) =>
        seguro.type.toLowerCase().includes(filterValue) ||
        seguro.asegure.toLowerCase().includes(filterValue) ||
        seguro.polize.toLowerCase().includes(filterValue)
    );
  }
}
