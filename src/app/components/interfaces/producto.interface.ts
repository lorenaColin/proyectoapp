export interface ProductInterface {
    id:string
    product_key: string;
    unit: string;
    unit_description?: string;
    unit_price: number;
    quantity: number;
    identifier_number: number;
    internal_key: number;
    description?: string;
    uuid_company: string;
    status: string;
  }
  
  export interface ProductResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: ProductInterface;
  }
  
  export interface ProductListResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: ProductInterface[];
  }