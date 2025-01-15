import { Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { Menu, NavService } from '../../services/nav.service';
import { AuthService } from '../../../components/services/auth.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrl: './content-layout.component.scss'
})
export class ContentLayoutComponent {
  public menuItems!: Menu[];
    private authService = inject(AuthService)
  
  constructor(
    public navServices: NavService,
    private elementRef: ElementRef,
  ){}

  clearToggle() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    html?.setAttribute('data-toggled', 'close');
    document.querySelector('#responsive-overlay')?.classList.remove('active');
  }

  togglesidemenuBody() {
    if(localStorage.getItem('ynex-sidemenu-styles') == 'icontext'){
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
  ngOnInit(): void {
  }
}
