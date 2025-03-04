import { Component, inject } from '@angular/core';
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
  listAutotransporte:AutotransportInterface [] = [];

  private cartaPorteService = inject(CartaPorteService);
  // formAutotrasporte = this.cartaPorteService.getAutotrasporte();
  private AutotransporteService = inject(AutotransportService);
  formCartaPorte = this.cartaPorteService.getFormCarta();
  constructor( private fb: FormBuilder) {
    this.formAutotrasporte = this.fb.group({
      autotransporte: this.cartaPorteService.getAutotrasporte(),
    });
  }

  ngOnInit(): void {
    this.loadTrasporte();
  }
  loadTrasporte(): void {

    this.AutotransporteService.getAutotransports().subscribe((response) => {
      const { error, data } = response;
      console.log('Datos recibidos:', data);
      (!error) ? this.listAutotransporte = data : '';
    });
  }

}


