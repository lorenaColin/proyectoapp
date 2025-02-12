export interface AutotransportInterface {
    id: number;
    configVehicular: string,
    anioModeloVM: number,
    placaVM: string,
    pesoBrutoVehicular: number,
    permSCT: string,
    numPermisoSCT: string,
    aseguraRespCivil: string,
    polizaRespCivil: string,
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