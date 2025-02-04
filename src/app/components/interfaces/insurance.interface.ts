export interface InsuranceInterface {
  id: number;
  type: string;
  asegure: string;
  polize: string;
  company_id: string;
}

export interface InsuranceResponseInterface {
  message: string;
  statusCode: number;
  error: boolean;
  data: InsuranceInterface;
}

export interface InsuranceListInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: any[];
}
