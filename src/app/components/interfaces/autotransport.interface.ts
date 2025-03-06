export interface AutotransportInterface {
    id: number;
    configVehicular: string,
    anioModeloVM: string,
    placaVM: string,
    pesoBrutoVehicular: string,
    permSCT: string,
    numPermisoSCT: string,
    aseguraRespCivil: string,
    polizaRespCivil: string,
    tipoRemolque: string,
    company_id: string,
}

export interface AutotransportResponseInterface {
    message:    string;
    statusCode: number;
    error:      boolean;
    data:       AutotransportInterface;
}

export interface Data {
    Autotransport:  AutotransportInterface;
    token: string;
}

export interface AutotransportListInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: any[];
}