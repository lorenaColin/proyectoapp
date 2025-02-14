export interface FigurasInterface {
    id: number;
    tipoFigura: string;
    rfcFigura: string;
    numLicencia: string;
    nombreFigura: string;
    numRegIdTribFigura: string;
    residenciaFiscalFigura: string;
    domicilio: string;
    pais: string;
    codigoPostal: string;
    estado: string;
    municipio: string;
    localidad: string;
    colonia: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    referencia: string;
    uuid_company: string;

}

export interface FigurasResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: FigurasInterface;
}

export interface FigurasListResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: any[];
}
export interface catpais {
    c_pais: string;
    descripcion: string;
  }
  export interface ApiResponsepais {
    message: string;
    statusCode: number;
    error: boolean;
    data: catpais[];  
  }
