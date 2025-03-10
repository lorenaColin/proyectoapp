import { Component, HostListener, inject, Input } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';
import { ubicacionesService } from '../../../../../services/ubicaciones.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ubicacionInterface } from '../../../../../interfaces/ubicaciones.interface';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';

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
  filteredList: ubicacionInterface[] = [];
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
    this.loadubicacion();
    this.addUbicacion('Origen');
    this.addUbicacion('Destino');
  }

  loadubicacion(): void {
    this.ubicacioneService.getAllubicacion().subscribe((response) => {
      const { error, data } = response;
      console.log('Datos de ubicaciones recibidos:', data);

      if (!error) {
        this.listUbicaciones = Array.isArray(data) ? data : [data];

        this.listRFCOrigen = this.listUbicaciones.filter(
          (ubicacion) => ubicacion.tipoUbicacion === 'ORIGEN'
        );

        this.listRFCDestino = this.listUbicaciones.filter(
          (ubicacion) => ubicacion.tipoUbicacion === 'DESTINO'
        );
      }
    });
  }

  addUbicacion(tipo: string) {
    const ubicacionesnew = this.fb.group({
      id: [],
      tipo: [tipo, Validators.required],
      rfc: ['',],
      datosGenerales: ['', Validators.required],
      fechaHora: ['', Validators.required],
      distancia: ['', Validators.required],
    });

    this.ubicaciones.push(ubicacionesnew);
  }


  removeProducto(index: number) {
    this.ubicaciones.removeAt(index);
  }

  onInput(event: any, index: number, field: string): void {
    this.activeIndex = index;

    const query = (event.target.value || '').trim().toLowerCase();
    console.log(`Texto ingresado en ${field} de la fila ${index}:`, query);

    const row = this.ubicaciones.at(index);
    if (!row) return;

    const tipoUbicacion = row.get('tipo')?.value;
    console.log(`Tipo de Ubicación para la fila ${index}:`, tipoUbicacion);

    this.showLoader = true;
    console.log('Loader activado');

    setTimeout(() => {
      if (query.length < 3) {
        this.filteredRFCOrigen = [];
        this.filteredRFCDestino = [];
        this.showLoader = false;
        return;
      }

      if (tipoUbicacion === 'Origen') {
        this.filteredRFCOrigen = this.listRFCOrigen.filter((ubicacion: ubicacionInterface) =>
          ubicacion.rfc.toLowerCase().includes(query)
        );
        console.log(`RFC filtrados para ORIGEN:`, this.filteredRFCOrigen);
      } else if (tipoUbicacion === 'Destino') {
        this.filteredRFCDestino = this.listRFCDestino.filter((ubicacion: ubicacionInterface) =>
          ubicacion.rfc.toLowerCase().includes(query)
        );
        console.log(`RFC filtrados para DESTINO:`, this.filteredRFCDestino);
      }

      this.showLoader = false;
    }, 1000);
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
    if (!targetElement.closest('#rfc')) {
      this.filteredRFC = [];
    }
  }

  selectSerieWrapper(ubicacion: any, index: number, tipo: string): void {
    console.log('Ubicación seleccionada:', ubicacion);
    console.log('Índice recibido:', index);
    console.log('Tipo recibido:', tipo);

    if (!ubicacion || !ubicacion.idUbicacion || !ubicacion.rfc) {
      console.error('Ubicación inválida o datos faltantes:', ubicacion);
      return;
    }

    const row = this.ubicaciones.at(index);

    const rfcControl = row.get('rfc');


    const value = `${ubicacion.idUbicacion} - ${ubicacion.rfc}`;
    rfcControl?.setValue(value);

    this.filteredRFCOrigen = [];
    this.filteredRFCDestino = [];
    this.activeIndex = null;
  }

}
