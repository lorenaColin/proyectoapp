export interface CustomersInterface {
  id: number;
  name: string;
  rfc: string;
  cp?: string;
  residence?: string;
  num_reg_id_trib?: string;
  regime: string;
  address?: string;
  email?: string;
  phone?: string;
  status: string;
  payment_form?: string;
  payment_method?: string;
  company_id: string;
}

export interface CustomerResponseInterface {
    message:    string;
    statusCode: number;
    error:      boolean;
    data:       CustomersInterface;
}

export interface Data {
    customer:  CustomersInterface;
    token: string;
}

export interface CustomerListInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: any[];
}