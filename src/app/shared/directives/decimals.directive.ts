import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDecimals]',
})
export class DecimalsDirective {
  // private specialKeys: Array<string> = ['ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  
  constructor(private el: ElementRef) {
    // console.log(":::")
  }
  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent) {

    setTimeout(()=>{
      let input = this.el.nativeElement.value;
      let cadenaNumero = input.toString();
      let posicionPunto = cadenaNumero.lastIndexOf('.');
      let esDecimal = posicionPunto != -1;
      let numeroEntero  = ( esDecimal ) ? cadenaNumero.substr(0, posicionPunto) : cadenaNumero;
      let decimales = ( esDecimal ) ? cadenaNumero.substr(posicionPunto + 1 ) : "";
      decimales = decimales.length > 6 ? decimales.substr( 0, 6 ) : decimales.padEnd(6, "0");
      numeroEntero = numeroEntero.length === 0 ? "0": numeroEntero;
      // console.log(`${ numeroEntero }.${ decimales }`)
      this.el.nativeElement.value = `${ numeroEntero }.${ decimales }`;
    }, 2000);
  }

}
