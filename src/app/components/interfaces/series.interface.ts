export interface SerietInterface {
    id: number;
    serie: string;
    folio: string;
    tipoComprobante?: string;
    uuid_company: string;
    status: string;
  }
  
  export interface SerietResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: SerietInterface;
  }
  
  export interface SerietListResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: SerietInterface[];
  }