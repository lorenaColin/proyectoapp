export interface remolquesInterface {
    id: number;
    SubTipoRem: string;
    placa: string;
    uuid_company: string;

}

export interface remolquesResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: remolquesInterface;
    paises?: string[];
}

export interface remolquesListResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: remolquesInterface[];
}