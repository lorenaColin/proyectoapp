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
export interface MetodoMonedaPago {
    forma:      string;
    descripcion: string;
}
export interface ListaBanco {
    id_Banco:      string;
    c_Banco: string;
    Descripcion:string;
    NombreRazonsocial:string;
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


export interface impuestoInterface {
    base:       string;
    impuesto:   string;
    tasaOCuota: string;
    importe:    number;
  }
  
export interface tasaOCuotaInterface {
    valor:      string;
    impuesto:   string
    tasaOCuota: string;
}



export interface fechaInterface {
    fecha: string;
}