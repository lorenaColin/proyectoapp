import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
// Menu
export interface Menu {
  headTitle?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeValue?: string;
  badgeClass?: string;
  badgeText?: string;
  active?: boolean;
  selected?: boolean;
  bookmark?: boolean;
  children?: Menu[];
  children2?: Menu[];
  Menusub?: boolean;
  target?: boolean;
  menutype?:string
}

@Injectable({
  providedIn: 'root',
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );

  // Search Box
  public search = false;

  // Language
  public language = false;

  // Mega Menu
  public megaMenu = false;
  public levelMenu = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen = false;
  active: any;

  constructor(private router: Router) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }
  }

  ngOnDestroy() {
    this.unsubscriber.next;
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    // Dashboard
    {
      headTitle: 'Catalogos',
    },
    {
      title: 'Catalogos',
      icon: 'home',
      type: 'sub',
      badgeClass: 'warning',
      badgeText: 'warning',
      badgeValue: '3',
      selected: false,
      active: false,
      children: [
        { path: '/customers/', title: 'Clientes', type: 'link' },
        { path: '/products/', title: 'Productos', type: 'link' },
        { path: '/series/', title: 'Series', type: 'link' },
        {
          path: '/cartaPorte/',
          title: 'cartaPorte',
          type: 'sub', 
          selected: false,
          active: false,
          children: [
            { path: '/cartaPorte/ubicaciones', title: 'Ubicaciones', type: 'link' },
            { path: '/cartaPorte/autotrasporte', title: 'Autotransporte', type: 'link' },
            { path: '/cartaPorte/figuras', title: 'Figuras', type: 'link' },
            { path: '/cartaPorte/remolques', title: 'Remolques', type: 'link' },
            { path: '/cartaPorte/seguros', title: 'Seguros', type: 'link' },
            { path: '/cartaPorte/mercancias', title: 'Mercancías', type: 'link' },
            // { path: '/cartaPorte/productos', title: 'Productos', type: 'link' },
          ],
        },
      ],
    },
 
    { headTitle: 'Comprobantes' },
    {
      title: 'Comprobantes',
      type: 'sub',
      selected : false,
      active: false,
      icon: 'file',
      badgeClass: 'secondary',
      badgeText: 'secondary',
      badgeValue: 'New',
      children: [
        { path: '/invoices/ingreso', title: 'CFDI 4.0', type: 'link' },
        { path: '/invoices/traslado', title: 'Carta Porte', type: 'link' },
        // { path: '/invoices/paysheet', title: 'Nómina CFDI 4.0', type: 'link' },
        // { path: '/invoices/list', title: 'Listar', type: 'link' },
      ],
    },  


    // { headTitle: 'lealtad' },
    // {
    //   title: 'Referidos',
    //   type: 'sub',
    //   selected : false,
    //   active: false,
    //   icon: 'file',
    //   badgeClass: 'secondary',
    //   badgeText: 'secondary',
    //   badgeValue: 'New',
    //   children: [
    //     { path: '/lealtad', title: 'Lealtad', type: 'link' },
      
    //   ],
    // },  
    { headTitle: 'Herramientas' },
    {
      title: 'Herramientas',
      type: 'sub',
      selected : false,
      active: false,
      icon: 'archive',
      badgeClass: 'secondary',
      badgeText: 'secondary',
      badgeValue: 'New',
      children: [
        { path: '/herramienta', title: 'Recuperacion de certificados', type: 'link' },
      
      ],
    },  
    { headTitle: 'emitidos' },
    {
      title: 'Emitidos',
      type: 'sub',
      selected : false,
      active: false,
      icon: 'file',
      badgeClass: 'secondary',
      badgeText: 'secondary',
      badgeValue: 'New',
      children: [
        { path: '/emitidos/ingreso', title: 'CFDI 4.0 Ingreso', type: 'link' },
        { path: '/emitidos/egreso', title: 'CFDI 4.0 Egreso', type: 'link' },
    { path: '/emitidos/cp', title: 'Carta Porte', type: 'link' },
      
      ],
    },  
    {
  headTitle: 'Mis empresas'
},
{
  title: 'Mis empresas',
  type: 'link', 
  path: '/administration',
  selected: false,
  active: false,
  icon: 'briefcase',
  badgeClass: 'secondary',
  badgeText: 'secondary',
  badgeValue: 'New',
}
    
  ];
  

  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
