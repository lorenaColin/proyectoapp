import { Component, inject, Input } from '@angular/core';
import { CartaPorteService } from '../../../../../services/carta-porte.service';
import { AutotransportService } from '../../../../../services/autotransport.service';
import { AutotransportInterface } from '../../../../../interfaces/autotransport.interface';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-autotrasporte',
  templateUrl: './form-autotrasporte.component.html',
  styleUrl: './form-autotrasporte.component.scss'
})
export class FormAutotrasporteComponent {
  formAutotrasporte: FormGroup;
  formRemolque: FormGroup;

  private cartaPorteService = inject(CartaPorteService);
  private AutotransporteService = inject(AutotransportService);
  formCartaPorte = this.cartaPorteService.getFormCarta();

  // @Input() formRemolques!: FormGroup;
  constructor(private fb: FormBuilder) {
    this.formAutotrasporte = this.cartaPorteService.getAutotransporteForm();
    this.formRemolque = this.cartaPorteService.getRemolques();

  }
  listAutotransporte: AutotransportInterface[] = [];
  ngOnInit(): void {
    this.loadTrasporte();
  }
  loadTrasporte(): void {

    this.AutotransporteService.getAutotransports().subscribe((response) => {
      const { error, data } = response;
      console.log('Datos de autotrasporte recibidos:', data);
      (!error) ? this.listAutotransporte = data : '';
    });
  }

  selectedAutotransport: AutotransportInterface | null = null;

  cargeAutotransport(event: Event): void {
    const selectedId = +(event.target as HTMLSelectElement).value;

    if (selectedId) {
      this.selectedAutotransport = this.listAutotransporte.find(
        (autotransporte) => autotransporte.id === selectedId
      ) || null;

      console.log(this.selectedAutotransport);

      if (this.selectedAutotransport) {
        this.formAutotrasporte.patchValue({
          placa: this.selectedAutotransport.id,
          PermSCT2: this.selectedAutotransport.permSCT,
          NumPermisoSCT: this.selectedAutotransport.numPermisoSCT,
          aCivil: this.selectedAutotransport.aseguraRespCivil,
          cVehicle: this.selectedAutotransport.configVehicular,
          anioVehicle: this.selectedAutotransport.anioModeloVM,
          weighVehicle: this.selectedAutotransport.pesoBrutoVehicular,
        });

        this.selectedAutotransport.tipoRemolque === '0' ? this.formRemolque.disable() : this.formRemolque.enable();

      }
    } else {
      this.formAutotrasporte.reset();
      this.formRemolque.enable();
    }
  }

}


