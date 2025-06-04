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
  timbres: number = 100;
  precio: number = this.calculatePrice(this.timbres);

  calculatePrice(timbres: number): number {
    return timbres * 0.1; 
  }

  onTimbradoChange(value: number): void {
    this.timbres = value;
    this.precio = this.calculatePrice(value);
  }
}
