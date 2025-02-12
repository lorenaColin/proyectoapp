export interface ProductInterface {
    id:string
    product_key: string;
    // descripcion_producto:string;
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

  export interface catproducto {
    c_ClaveProdServ: string;
    descripcion: string;
    PalabrasSimilares:string;
  }
  export interface ApiResponseProducto {
    message: string;
    statusCode: number;
    error: boolean;
    data: catproducto[];  
  }
  export interface catUnidad {
    c_claveunidad: string;
    nombre: string;
  }
  export interface ApiResponseUnidad {
    message: string;
    statusCode: number;
    error: boolean;
    data: catUnidad[];  
  }

  