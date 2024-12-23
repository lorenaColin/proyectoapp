export interface RegimenInterface {
    RegimenFiscal: number;
    descripcion:   string;
    fisica:        number;
    moral:         number;
}


export interface MetodoPagoInterface {
    metodo:      string;
    descripcion: string;
}


export interface FormaPagoInterface {
    clave:       string;
    descripcion: string;
    metodoPago:  string;
}


export interface UsoCfdiInterface {
    nombre:  string;
    uso:     string;
    regimen: number[];
}