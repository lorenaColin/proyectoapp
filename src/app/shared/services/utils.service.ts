import { Injectable } from '@angular/core';
import { LISTADORFCSGENERICOS, LISTADOREGIMEN } from '../utils/sat';
import { RegimenInterface } from '../interfaces/shared.interface';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    
    getRegimenSat(rfc: string): RegimenInterface[]{
        return LISTADORFCSGENERICOS.includes(rfc) ? LISTADOREGIMEN.filter(regimen => regimen.RegimenFiscal === 616) : LISTADOREGIMEN.filter(regimen => rfc.length === 13 ? regimen.fisica : regimen.moral);
    }


    getCpSat(cp: string): string {
        //TODO: Aca vamos a realizar la logica del codigo postal del emisor y receptor
        return cp;
    }
}