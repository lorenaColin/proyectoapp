import { Injectable } from '@angular/core';
import { LISTADORFCSGENERICOS, LISTADOREGIMEN, LISTADOFORMAPAGO, TASAOCUOTA } from '../utils/sat';
import { fechaInterface, FormaPagoInterface,  RegimenInterface, tasaOCuotaInterface } from '../interfaces/shared.interface';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    
    getRegimenSat(rfc: string): RegimenInterface[]{
        return LISTADORFCSGENERICOS.includes(rfc) ? LISTADOREGIMEN.filter(regimen => regimen.RegimenFiscal === 616) : LISTADOREGIMEN.filter(regimen => rfc.length === 13 ? regimen.fisica : regimen.moral);
    }
    
    getFormaPago(metodoPago:string):FormaPagoInterface[]{
        return LISTADOFORMAPAGO.filter(m => m.metodoPago === metodoPago);
    }


    getCpSat(cp: string): string {
        //TODO: Aca vamos a realizar la logica del codigo postal del emisor y receptor
        return cp;
    }


    getTasaOcuota(impuesto:string): tasaOCuotaInterface[]{
        return TASAOCUOTA.filter(i => i.impuesto === impuesto);
    }
    
    getDates(): fechaInterface[] {
        let listadoFechas: fechaInterface[] = [{fecha: moment().format('YYYY-MM-DD')}];
        [1,2,3].forEach((dia:number) => listadoFechas.push({fecha: moment().subtract(dia, 'days').format('YYYY-MM-DD')}));
        return listadoFechas;
    }

    decimales(valor:string): number{
        let cadenaNumero = valor.toString();
        let posicionPunto = cadenaNumero.lastIndexOf('.');
        let esDecimal = posicionPunto != -1;
        let numeroEntero  = ( esDecimal ) ? cadenaNumero.substring(0, posicionPunto) : cadenaNumero;
        let decimales = ( esDecimal ) ? cadenaNumero.substring(posicionPunto + 1 ) : "";
        decimales = decimales.length > 6 ? decimales.substring(0, 6) : decimales.padEnd(7, "0");
        numeroEntero = numeroEntero.length === 0 ? "0": numeroEntero;
        return parseFloat(`${ numeroEntero }.${ decimales }`);
    }

    // truncar(numero:string, decimales: number): string{
    //     let expresion = ( decimales === 6 ) ? /(\d*.\d{0,6})/ : /(\d*.\d{0,2})/;
    //     return numero.match(expresion)[0] || 'null';
    // }
}