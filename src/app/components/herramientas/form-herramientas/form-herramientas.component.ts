import { Component } from '@angular/core';

@Component({
  selector: 'app-form-herramientas',
  templateUrl: './form-herramientas.component.html',
  styleUrl: './form-herramientas.component.scss'
})
export class FormHerramientasComponent {
  ngOnInit(): void {
    window.open('https://portalsat.plataforma.sat.gob.mx/RecuperacionDeCertificados/', '_blank');
  }
}
