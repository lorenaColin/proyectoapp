import { Component, ElementRef, inject, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { ubicacionesService } from '../../../../services/ubicaciones.service';
import { ubicacionInterface, ubicacionResponseInterface } from '../../../../interfaces/ubicaciones.interface';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-list-ubicaciones',
  templateUrl: './list-ubicaciones.component.html',
  styleUrl: './list-ubicaciones.component.scss'
})
export class ListUbicacionesComponent {

  private ubicacionesService = inject(ubicacionesService);
  // myForm = this.ubicacionesService.getFormUbicacion();
  // myForm = this.ubicacionesService.getFormUbicacion();
  ubicacionForm!: FormGroup;  // Agrega esta propiedad
  constructor(private el: ElementRef) { }
  ubicaciones: ubicacionInterface[] = [];
  @Input() ubicacion: ubicacionInterface = {} as ubicacionInterface;
  @Input() buttonTitle: string = 'Editar';
  showLoader = false;
  private ubicacionServicio = inject(ubicacionesService);
  ubicacionSeleccionado: ubicacionInterface = {} as ubicacionInterface;
 
  ngOnInit(): void {
    this.showLoader = true;
    this.ubicacionServicio.getAllubicacion().subscribe((response) => {
      let { error, data } = response;
      console.log(data);
      if (!error) {
        if (Array.isArray(data)) {
          this.ubicaciones = data;
        } else {
          console.error('Se esperaba un arreglo, pero se recibió un objeto.');
        }
        console.log(data);
      }
      this.showLoader = false;
    });
  }

  editUbicacion(id: number): void {
    this.showLoader = true;
    console.log("ID que se pasa al backend:", id);
    this.ubicacionServicio.getubicacionById(id).subscribe({
      next: (response) => {
        this.ubicacion = response.data;
        console.log(this.ubicacion);
        
        this.showLoader = false;
      },
      error: (err) => {
        console.error('Error al obtener la ubicacion:', err);
        Swal.fire({
          title: 'Error al obtener la ubicacion',
          text: err.message || 'Error desconocido',
          icon: 'error',
        });
        this.showLoader = false;
      },

    });
  }

  responseUbicacion(response: ubicacionInterface): void {
    const adaptedResponse: ubicacionResponseInterface = {
      message: response.idUbicacion ? 'Serie procesada' : 'Error al procesar la serie',
      statusCode: response.id ? 200 : 500,
      error: !response.tipoUbicacion,
      data: response
    };

    const { message, data, error } = adaptedResponse;

    if (error) {
      Swal.fire({
        title: data.idUbicacion || data.tipoUbicacion || 'Error desconocido',
        icon: 'error',
      });
      return;
    }

    const indice = this.ubicaciones.findIndex((ubi) => ubi.id === data.id);
    if (indice !== -1) {
      this.ubicaciones[indice] = data;
      Swal.fire({
        title: 'ubicacion actualizada exitosamente',
        icon: 'success',
      });
    } else {
     
      this.ubicaciones.push(data);
      Swal.fire({
        title: 'ubicacion creada exitosamente',
        icon: 'success',
      });
    }
  }
  openModal() {
    const button = this.el.nativeElement.querySelector('.hs-tooltip-toggle');
    button.click();
  }
  // showUbicaciones() {
  //   Swal.fire({
  //     title: '¿Qué tipo de ubicación deseas crear?',
  //     text: 'Selecciona si es origen o destino.',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Origen',
  //     cancelButtonText: 'Destino',
  //     reverseButtons: true
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.ubicacionForm = this.ubicacionesService.getFormUbicacion("ORIGEN"); 
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       this.ubicacionForm = this.ubicacionesService.getFormUbicacion("DESTINO"); 
  //     }
  //     this.openModal();
  //   });
  // }
  showUbicaciones() {
    this.ubicacion = {} as ubicacionInterface;
    this.ubicacionForm = this.ubicacionesService.getFormUbicacion("");
  
    Swal.fire({
      title: '¿Qué tipo de ubicación deseas crear?',
      text: 'Selecciona si es origen o destino.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Origen',
      cancelButtonText: 'Destino',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.ubicacionForm = this.ubicacionesService.getFormUbicacion("ORIGEN"); 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.ubicacionForm = this.ubicacionesService.getFormUbicacion("DESTINO"); 
      }
      this.openModal();
    });
  }
  
  
  // showUbicaciones() {
  //   Swal.fire({
  //     title: '¿Qué tipo de ubicación deseas crear?',
  //     text: 'Selecciona si es origen o destino.',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Origen',
  //     cancelButtonText: 'Destino',
  //     reverseButtons: true
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.myForm.patchValue({
  //         tipoUbicacion: "origen"
  //       })
  //       this.openModal();
  //       console.log('Seleccionaste Origen');
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       this.myForm.patchValue({
  //         tipoUbicacion: "destino"
  //       })
  //       this.openModal();
  //       console.log('Seleccionaste Destino');
  //     }
  //   });
  // }
  // showUbicaciones() {
  //   Swal.fire({
  //     title: '¿Qué tipo de ubicación deseas crear?',
  //     text: 'Selecciona si es origen o destino.',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Origen',
  //     cancelButtonText: 'Destino',
  //     reverseButtons: true
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.myForm.patchValue({
  //         tipoUbicacion: "origen",
  //         idUbicacion: 'OR' + (this.myForm.get('idUbicacion')?.value || '')  // Prefijo 'OR'
  //       });
  //       this.openModal();
  //       console.log('Seleccionaste Origen');
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       this.myForm.patchValue({
  //         tipoUbicacion: "destino",
  //         idUbicacion: 'DE' + (this.myForm.get('idUbicacion')?.value || '')  // Prefijo 'DE'
  //       });
  //       this.openModal();
  //       console.log('Seleccionaste Destino');
  //     }
  //   });
  // }


}
