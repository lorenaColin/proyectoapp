import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { fromEvent } from 'rxjs';



@Component({
  selector: 'app-authentication-layout',
  templateUrl: './authentication-layout.component.html',
  styleUrl: './authentication-layout.component.scss'
})
export class AuthenticationLayoutComponent {
  constructor(
    @Inject(DOCUMENT) private document: Document,private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
  
      this.renderer.addClass(this.document.body, 'bg-white');
      this.renderer.addClass(this.document.body, 'dark:bg-!bodybg');
      const ltr = this.elementRef.nativeElement.querySelectorAll('#switcher-ltr');
      const rtl = this.elementRef.nativeElement.querySelectorAll('#switcher-rtl');

      fromEvent(ltr, 'click').subscribe(() => {
        this.customOptions = { ...this.customOptions, rtl: false };
      });

      fromEvent(rtl, 'click').subscribe(() => {
        this.customOptions = { ...this.customOptions, rtl: true, autoplay: true };
      });      

    }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'bg-white');
    this.renderer.removeClass(this.document.body, 'dark:bg-!bodybg');
  }

  customOptions: OwlOptions = {
    loop: true,
    rtl:false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    navText: ['<', '>'],
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: {items: 1},
      400: { items: 1 },
      740: {  items: 1},
      1000: { items: 1},
    },
    nav: true,
  };

  activeSlides!: SlidesOutputData;

  slidesStore: any[] = [
    {img:'./images/cintegran.jpg'},
    { img:'./images/cintegran2.jpg'},
    { img:'./images/cintegran3.jpg'},
  ];

  getPassedData(data: SlidesOutputData) {
    this.activeSlides = data;
    console.log(this.activeSlides);
  }

}
