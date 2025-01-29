export interface ubicacionInterface {
    id: number;
    rfc: string;
    idUbicacion: string;
    NombreRemitenteDestinatario: string;
    numRegIdTrib: string;
    residenciaFiscal: string;
    tipoUbicacion: string;
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

export interface ubicacionResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: ubicacionInterface;
    paises?: string[];
}

export interface ubicacionListResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: ubicacionInterface[];
}