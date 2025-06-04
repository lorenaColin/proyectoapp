import { Component, inject, Input, OnInit } from '@angular/core';
import { ProductInterface, ProductResponseInterface } from '../../interfaces/producto.interface';
import { productoServicio } from '../../services/productoServicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input() producto: ProductInterface = {} as ProductInterface;
  productos: ProductInterface[] = [];

  filteredProducto: ProductInterface[] = [];

  @Input() buttonTitle: string = 'Editar';
  showLoader = false;

  private productService = inject(productoServicio);

  // ngOnInit(): void {
  //   this.showLoader = true;

  //   this.productService.getAllProducts().subscribe(
  //     (response) => {
  //       console.log(response);
  //       if (Array.isArray(response)) {
  //         this.productos = response;
  //         this.filteredProducto = [...response];

  //       } else {
  //         console.error('La respuesta no es un array', response);
  //         this.productos = [];

  //       }
  //       this.showLoader = false
  //     },
  //     (error) => {
  //       console.error('Error en la solicitud:', error);
  //       this.productos = [];
  //       this.showLoader = false;

  //     }

  //   );


  // }
ngOnInit(): void {
  this.showLoader = true;

  this.productService.getAllProducts().subscribe(
    (response) => {
      this.showLoader = false;

      if (Array.isArray(response)) {
        const uuid = this.getCompanyUuid();
        if (uuid) {
          this.productos = response.filter(p => p.uuid_company === uuid);
        } else {
          this.productos = [];
        }
        this.filteredProducto = [...this.productos];
      } else {
        console.error('La respuesta no es un array', response);
        this.productos = [];
      }
    },
    (error) => {
      console.error('Error en la solicitud:', error);
      this.productos = [];
      this.showLoader = false;
    }
  );
}



private getCompanyUuid(): string | null {
  return localStorage.getItem('company');
}


  editCustomer(id: string): void {
    this.showLoader = true;

    console.log("ID que se pasa al backend:", id);
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        this.producto = response.data;
        status: response.data.status === 'Activo',
          console.log(this.producto);

        this.showLoader = false;

      },
      error: (err) => {
        console.error('Error al obtener el producto:', err);
        Swal.fire({
          title: 'Error al obtener el producto',
          text: err.message || 'Error desconocido',
          icon: 'error',
        });
        this.showLoader = false;

      },
    });
  }

  responseproducto(response: ProductInterface): void {
    const adaptedResponse: ProductResponseInterface = {
      message: response.identifier_number ? 'Producto procesado' : 'Error al procesar el producto',
      statusCode: response.internal_key ? 200 : 500,
      error: !response.unit_description,
      data: response
    };

    const { message, data, error } = adaptedResponse;

    if (error) {
      Swal.fire({
        title: data.internal_key || data.product_key || 'Error desconocido',
        icon: 'error',
      });
      return;
    }

    const indice = this.productos.findIndex((producto) => producto.id === data.id);
    if (indice !== -1) {
      this.productos[indice] = data;
      Swal.fire({
        title: 'Producto actualizado exitosamente',
        icon: 'success',
      });
    } else {
      this.productos.push(data);
      Swal.fire({
        title: 'Producto creado exitosamente',
        icon: 'success',
      });
    }
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.productos = this.filteredProducto.filter(
      (seguro) =>
        seguro.product_key.toString().includes(filterValue) ||
        seguro.identifier_number.toString().includes(filterValue)

    );
  }

}
