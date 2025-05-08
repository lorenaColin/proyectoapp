import { Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { Menu, NavService } from '../../services/nav.service';
import { AuthService } from '../../../components/services/auth.service';
import { CompanyService } from '../../../components/services/company.service';
import { CompanyDetailService } from '../../../components/services/companyDetail.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrl: './content-layout.component.scss'
})
export class ContentLayoutComponent {
  public menuItems!: Menu[];
  private authService = inject(AuthService)
  showLoader = false;

  // constructor(
  //   public navServices: NavService,
  //   private elementRef: ElementRef,
  // ) { }
  constructor(
    public navServices: NavService,
    private elementRef: ElementRef,
    private router: Router
  ) {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      const currentUrl = event.urlAfterRedirects || event.url;
      this.mostrarContenido = currentUrl === '/dashboard'; // o la ruta de tu dashboard exacta
    });
  }
  emitirFactura() {
    this.router.navigate(['/invoices/ingreso']);
  }
  navegarConLoader(ruta: string): void {
    this.showLoader = true;
  
    setTimeout(() => {
      this.router.navigate([ruta]).then((navegado) => {
        this.showLoader = false;
        if (!navegado) {
          console.error('Error al navegar a:', ruta);
        }
      });
    }, 500);
  }
  clearToggle() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    html?.setAttribute('data-toggled', 'close');
    document.querySelector('#responsive-overlay')?.classList.remove('active');
  }
  mostrarContenido = true;
  togglesidemenuBody() {
    if (localStorage.getItem('ynex-sidemenu-styles') == 'icontext') {
      document.documentElement.removeAttribute('icon-text');
    }
    if (document.documentElement.getAttribute('data-nav-layout') == 'horizontal' && window.innerWidth > 992) {
      this.closeMenu();
    }
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (window.innerWidth <= 992) {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close' ? 'close' : 'close'
      );
    }
    this.mostrarContenido = false;
  }

  closeMenu() {
    this.menuItems?.forEach((a: any) => {
      if (this.menuItems) {
        a.active = false;
      }
      a?.children?.forEach((b: any) => {
        if (a.children) {
          b.active = false;
        }
      });
    });
  }
  // ngOnInit(): void {
  // }


  empresaNombre: string = '';
  companyId: string = ''; // <- tipo string
  Timbres: number = 0;
  Fecha: string = '';

  private company = inject(CompanyService);
  private companyDetail = inject(CompanyDetailService);

  ngOnInit(): void {
    this.obtenerNombreEmpresa();
  }

  obtenerNombreEmpresa() {
    this.company.listCompany().subscribe({
      next: (response) => {
        const company = response.data?.[0];
        this.empresaNombre = company?.name ?? 'Empresa';
        this.companyId = company?.id;

        if (this.companyId) {
          this.obtenerDetallesCompany(this.companyId);
        }
      },
      error: (err) => {
        console.error('Error al obtener empresa', err);
      }
    });
  }

  obtenerDetallesCompany(companyId: string) {
    console.log('Buscando detalles de la company con ID:', companyId);
    this.companyDetail.getetailById(companyId).subscribe({
      next: (detalle) => {
        console.log('Respuesta del detalle:', detalle);
        
        // Accede a los datos reales a través de "data"
        this.Timbres = detalle.data.tones_incluide;
        this.Fecha = detalle.data.fechaven;
        
        console.log('Respuesta del timbrtes:', this.Timbres);
        console.log('Respuesta del fecha:', this.Fecha);
      },
      error: (err) => {
        console.error('Error al obtener detalles de company', err);
      }
    });
  }
  
  
}

