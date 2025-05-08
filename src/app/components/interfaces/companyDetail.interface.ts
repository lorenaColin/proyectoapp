export interface companyDetailInterface {
    id: number;
    tones_incluide: number;
    fechaven: string;
    id_company: string;
  }
  
  export interface companyDetailResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: companyDetailInterface;  
  }
  
  export interface companyDetailListResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: companyDetailInterface[];
  }