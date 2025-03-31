import { Component, inject, Input } from '@angular/core';
import { figurasService } from '../../../../services/figuras.service';
import { FigurasInterface, FigurasListResponseInterface, FigurasResponseInterface } from '../../../../interfaces/figuras.interface';
import Swal from 'sweetalert2';
import { MercanciaResponseInterface } from '../../../../interfaces/mercancias.interface';

@Component({
  selector: 'app-list-figuras',
  templateUrl: './list-figuras.component.html',
  styleUrl: './list-figuras.component.scss'
})
export class ListFigurasComponent {
private figurasService = inject(figurasService);
// figuras: FigurasInterface[] = [];
filteredFigura: FigurasInterface[] = [];
@Input() figura: FigurasInterface = {} as FigurasInterface;
@Input() buttonTitle: string = 'Editar';
showLoader = false;
figuraSeleccionada: FigurasInterface = {} as FigurasInterface;


ngOnInit(): void {
  this.showLoader = true;
  this.figurasService.getAllFiguras().subscribe((response) => {
    let { error, data } = response;
    console.log(data);
    if (!error) {
      if (Array.isArray(data)) {
        this.figuras = data;
        this.filteredFigura = [...data];
      } else {
        console.error('Se esperaba un arreglo, pero se recibió un objeto.');
      }
      console.log(data);
    }
    this.showLoader = false;
  });
}
editFigura(id: number): void {
    this.showLoader = true;
    console.log("ID que se pasa al backend:", id);
    this.figurasService.getfigurasById(id).subscribe({
      next: (response) => {
        this.figura = response.data;
        console.log(this.figura);
        this.showLoader = false;
        
      },
      error: (err) => {
        console.error('Error al obtener la Figura:', err);
        Swal.fire({
          title: 'Error al obtener la Figura',
          text: err.message || 'Error desconocido',
          icon: 'error',
        });
        this.showLoader = false;
      },

    });
  }
  responseFigura(response: FigurasResponseInterface): void {
      const { message, error, data } = response;
      this.showLoader = true;
      if (error) {
        this.showLoader = false;
        const errorText = data?.rfcFigura?.[0] || 'Error desconocido.';
        Swal.fire({
          title: 'Error de validación',
          text: errorText,
          icon: 'error',
        });
        return;
      } 

        this.showLoader = false;
        Swal.fire({
          title: 'Operación exitosa',
          text: message,
          icon: 'success',
        });
        this.refreshInsuranceList();
      
    }
public listadoSeguros: FigurasInterface[] = [];
public figuras: FigurasInterface[] = [];

filteredInsurances: any[] = [];
  
    refreshInsuranceList(): void {
      this.showLoader = true;
      this.figurasService.getInsurance().subscribe(
        (response) => {
          this.figuras = response.data;
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

 
 applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.figuras = this.filteredFigura.filter(
      (auto) =>
        auto.tipoFigura.toLowerCase().includes(filterValue) ||
        auto.nombreFigura.toLowerCase().includes(filterValue) 
    );
    console.log(this.figuras);
  }

  
}
