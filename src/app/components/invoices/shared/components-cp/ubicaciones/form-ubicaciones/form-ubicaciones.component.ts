import { Component, HostListener, inject, Input } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';
import { ubicacionesService } from '../../../../../services/ubicaciones.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ubicacionInterface, ubicacionResponseInterface } from '../../../../../interfaces/ubicaciones.interface';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import Swal from 'sweetalert2';  // Asegúrate de importar SweetAlert2

@Component({
  selector: 'app-form-ubicaciones',
  templateUrl: './form-ubicaciones.component.html',
  styleUrl: './form-ubicaciones.component.scss'
})
export class FormUbicacionesComponent {
  private cartaPorteService = inject(CartaPorteService);
  formCartaPorte = this.cartaPorteService.getFormCarta();
  ubicaciones = this.cartaPorteService.getUbicacionesFormArray();
  private ubicacioneService = inject(ubicacionesService);
  @Input() buttonAdd: boolean = true;
  @Input() buttonDelete: boolean = true;
  private validatorsService = inject(ValidatorsService);

  showLoader = false;

  listRFC: ubicacionInterface[] = [];
  listRFCOrigen: ubicacionInterface[] = [];
  listRFCDestino: ubicacionInterface[] = [];
  selectedIndex: number = -1;
  filteredRFC: ubicacionInterface[] = [];
  listUbicaciones: ubicacionInterface[] = [];
  // filteredList: ubicacionInterface[] = [];
  filteredRFCOrigen: ubicacionInterface[] = [];
  filteredRFCDestino: ubicacionInterface[] = [];
  activeIndex: number | null = null;

  // constructor(private fb: FormBuilder) {
  //   this.ubicaciones = this.cartaPorteService.getUbicacionesFormArray();
  // }
  constructor(private fb: FormBuilder) {
    this.formCartaPorte = this.cartaPorteService.getFormCarta();
    this.ubicaciones = this.cartaPorteService.getUbicacionesFormArray();
  }

  ngOnInit(): void {
    // this.loadubicacion();
    this.addUbicacion('Origen');
    this.addUbicacion('Destino');
  }

  // loadubicacion(): void {
  //   this.ubicacioneService.getAllubicacion().subscribe((response) => {
  //     const { error, data } = response;
  //     console.log('Datos de ubicaciones recibidos:', data);

  //     if (!error) {
  //       this.listUbicaciones = Array.isArray(data) ? data : [data];

  //       this.listRFCOrigen = this.listUbicaciones.filter(
  //         (ubicacion) => ubicacion.tipoUbicacion === 'ORIGEN'
  //       );

  //       this.listRFCDestino = this.listUbicaciones.filter(
  //         (ubicacion) => ubicacion.tipoUbicacion === 'DESTINO'
  //       );
  //     }
  //   });
  // }

  addUbicacion(tipo: string) {
    const ubicacionesnew = this.fb.group({
      id: [],
      tipo: [tipo, Validators.required],
      rfc: ['', Validators.required],
      datosGenerales: ['', Validators.required],
      fechaHora: ['', Validators.required],
      distancia: ['', Validators.required],
    });

    this.ubicaciones.push(ubicacionesnew);
    this.subscribeToChanges(ubicacionesnew);
  }

  subscribeToChanges(ubicacionesnew: FormGroup) {
    const distanciaControl = ubicacionesnew.get('distancia');
    if (distanciaControl) {
      const distanciaSubscription = distanciaControl.valueChanges.subscribe((value) => {
        console.log('Cambio en distancia:', value);
      });
      // this.subscriptions.push(distanciaSubscription);
    }
    
  }
  removeProducto(index: number) {
    this.ubicaciones.removeAt(index);
  }

  // onInput(event: any, index: number, field: string): void {
  //   this.activeIndex = index;
  
  //   const query = (event.target.value || '').trim().toLowerCase();
  //   console.log(`Texto ingresado en ${field} de la fila ${index}:`, query);
  //   const control = this.ubicaciones.get('rfc');
  
  //   const row = this.ubicaciones.at(index);
  //   if (!row) return;
  
  //   const tipoUbicacion = row.get('tipo')?.value;
  //   console.log(`Tipo de Ubicación para la fila ${index}:`, tipoUbicacion);
  
  //   const currentRFC = row.get('rfc')?.value;
  //   if (currentRFC !== query) {
  //     this.clearGeneralData(index);
  //   }
  
  //   this.showLoader = true;
  
  //   if (query.length === 0) {
  //     control?.setErrors({ required: true });  
  
  //     if (control?.hasValidator(Validators.required)) {
  //       control.setValidators([Validators.required]);
  //     }
  //     control?.updateValueAndValidity();
  //     this.filteredRFCOrigen = [];
  //     this.filteredRFCDestino = [];
  //     this.showLoader = false;
  //     return;
  //   }
  
  //   if (query.length < 3) {
  //     row.get('rfc')?.setErrors({ notFound: true });
  //     this.filteredRFCOrigen = [];
  //     this.filteredRFCDestino = [];
  //     this.showLoader = false;
  //     return;
  //   }
  
  //   setTimeout(() => {
     
  //     if (query.length >= 3) {
  //       if (tipoUbicacion === 'Origen') {
  //         this.filteredRFCOrigen = this.listRFCOrigen.filter((ubicacion: ubicacionInterface) =>
  //           ubicacion.rfc.toLowerCase().includes(query)
  //         );
  //         if (this.filteredRFCOrigen.length === 0) {
  //           row.get('rfc')?.setErrors({ notFound: true }); 
  //         } else {
  //           row.get('rfc')?.setErrors(null); 
  //         }
  //       } else if (tipoUbicacion === 'Destino') {
  //         this.filteredRFCDestino = this.listRFCDestino.filter((ubicacion: ubicacionInterface) =>
  //           ubicacion.rfc.toLowerCase().includes(query)
  //         );
  //         if (this.filteredRFCDestino.length === 0) {
  //           row.get('rfc')?.setErrors({ notFound: true }); 
  //         } else {
  //           row.get('rfc')?.setErrors(null); 
  //         }
  //       }
  //     }
  
  //     this.showLoader = false; 
  //   }, 1000);
  // }
  
  tipoUbicacion: string = ''; 

  onInput(event: any, index: number, field: string): void {
    this.activeIndex = index;
    const query = (event.target.value || '').trim().toLowerCase();
    console.log(`Texto ingresado en ${field} de la fila ${index}:`, query);

    const row = this.ubicaciones.at(index);
    if (!row) return;
    const control = this.ubicaciones.get('rfc');
    const tipoUbicacion = row.get('tipo')?.value?.toUpperCase().trim();
    console.log(`Tipo de Ubicación para la fila ${index}:`, tipoUbicacion);
    const currentRFC = row.get('rfc')?.value;
      if (currentRFC !== query) {
        this.clearGeneralData(index);
      }
      this.showLoader = true
      if (query.length === 0) {
            control?.setErrors({ required: true });  
        
            if (control?.hasValidator(Validators.required)) {
              control.setValidators([Validators.required]);
            }
            control?.updateValueAndValidity();
            this.filteredRFC = [];
            this.showLoader = false;
            return;
          }
       
    if (query.length < 3) {
      row.get('rfc')?.setErrors({ notFound: true });
      this.filteredRFC = [];
      this.showLoader = false;
      return;
    }
    setTimeout(() => {
    this.ubicacioneService.getUbicacionesPorTipo(tipoUbicacion).subscribe((response) => {
        if (!response.data || !Array.isArray(response.data)) {
            return;
        }

        console.log('Datos obtenidos:', response.data);

        this.filteredRFC = response.data.filter((ubicacion: ubicacionInterface) =>
            ubicacion.NombreRemitenteDestinatario.toLowerCase().includes(query)
        );

        if (this.filteredRFC.length === 0) {
            row.get('rfc')?.setErrors({ notFound: true });
        } else {
            row.get('rfc')?.setErrors(null);
        }
        this.showLoader = false; 
    });
  }, 1000);
}

  
  private clearGeneralData(index: number): void {
    const row = this.ubicaciones.at(index);
    if (row) {
      row.get('datosGenerales')?.setValue(''); 
    }
  }
  
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      if (this.selectedIndex < (this.ubicaciones.get('tipo')?.value === 'Origen' ? this.filteredRFCOrigen.length : this.filteredRFCDestino.length) - 1) {
        this.selectedIndex++;
      }
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      event.preventDefault();
    } else if (event.key === 'Enter') {
      if (this.selectedIndex >= 0) {
        if (this.ubicaciones.get('tipo')?.value === 'Origen') {
          this.selectSerieWrapper(this.filteredRFCOrigen[this.selectedIndex], this.selectedIndex, 'Origen');
        } else if (this.ubicaciones.get('tipo')?.value === 'Destino') {
          this.selectSerieWrapper(this.filteredRFCDestino[this.selectedIndex], this.selectedIndex, 'Destino');
        }
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    
    if (!targetElement.closest('.rfc-container')) {
      this.filteredRFC = [];
    }
  }
  

  selectSerieWrapper(ubicacion: any, index: number, tipo: string): void {
    console.log('Ubicación seleccionada:', ubicacion);
    console.log('Índice recibido:', index);
    console.log('Tipo recibido:', tipo);
  
    const row = this.ubicaciones.at(index);
    const rfcControl = row.get('rfc');
    const value = `${ubicacion.idUbicacion} - ${ubicacion.rfc}`;
    
    rfcControl?.setValue(value);
  
    const tieneValor = ubicacion.calle || ubicacion.codigoPostal ||
     ubicacion.colonia || ubicacion.estado || ubicacion.localidad || 
     ubicacion.municipio || ubicacion.pais;
  
    if (tieneValor) {
      const datosGenerales = `
        Calle: ${ubicacion.calle || ''}
        Código Postal: ${ubicacion.codigoPostal || ''}
        Colonia: ${ubicacion.colonia || ''}
        Estado: ${ubicacion.estado || ''}
        Localidad: ${ubicacion.localidad || ''}
        Municipio: ${ubicacion.municipio || ''}
        País: ${ubicacion.pais || ''}
        Num Exterioir: ${ubicacion.numeroExterior || ''}
        Num interior: ${ubicacion.numeroInterior || ''}
      `;
      row.get('datosGenerales')?.setValue(datosGenerales);
    } else {
      row.get('datosGenerales')?.setValue('');
    }
  
    this.filteredRFC = [];
    
    this.activeIndex = null;
  }
  
  openModal(datosGenerales: string): void {
    Swal.fire({
      title: 'Datos Generales',
      html: `<pre style="font-size: 15px; font-family: Arial, sans-serif; text-align: left;">${datosGenerales}</pre>`, 
      showCancelButton: true,
      confirmButtonText: 'Cerrar',
      cancelButtonText: 'Cancelar',
    });
  }
  
  
  
  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.formCartaPorte, field);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.formCartaPorte, field);
  }

 
  
  
}
