import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  constructor(private router: Router) {}
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  irAlLogin() {
    this.router.navigate(['/auth/login']);
  }
  // El valor inicial del slider
  timbres: number = 100;
  // El precio calculado en función del valor del slider
  precio: number = this.calculatePrice(this.timbres);

  // Función para calcular el precio
  calculatePrice(timbres: number): number {
    return timbres * 0.1;  // Puedes ajustar esta fórmula según tus necesidades
  }

  // Función para manejar el cambio de valor del slider
  onTimbradoChange(value: number): void {
    this.timbres = value;
    this.precio = this.calculatePrice(value);
  }
}
