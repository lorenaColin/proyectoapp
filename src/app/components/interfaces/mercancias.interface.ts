export interface MercanciaInterface {
    id:number
    claveProdServCP: string;
    descripcion: string;
    claveUnidad: string;
    unidad: string;
    dimensiones: string;
    materialPeligroso: boolean;
    cveMaterialPeligroso: string;
    embalaje: string;
    descripEmbalaje:string;
    uuid_company: string;
  }
  
  export interface MercanciaResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: MercanciaInterface;
  }
  
  export interface MercanciaListResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: MercanciaInterface[];
    
  }
    export interface ApiResponseMercnaica {
      message: string;
      statusCode: number;
      error: boolean;
      data: MercanciaInterface[];  
    }
 // mercancias.interface.ts

export interface CatProdServCP {
  c_ClaveProdServ: string;
  descripcion: string;
  descripcion2: string;
  material_peligroso: string;
}
export interface ApiResponse {
  message: string;
  statusCode: number;
  error: boolean;
  data: CatProdServCP[];  
}

export interface catClaveUnidad {
  c_claveunidad: string;
  nombre: string;
}
export interface ApiResponseClave {
  message: string;
  statusCode: number;
  error: boolean;
  data: catClaveUnidad[];  
}

export interface catMatPeligroso {
  clave: string;
  descripcion: string;
}
export interface ApiResponseMatPeligroso {
  message: string;
  statusCode: number;
  error: boolean;
  data: catMatPeligroso[];  
}
export interface catEmbalaje {
  clave: string;
  descripcion: string;
}
export interface ApiResponseEmbalaje {
  message: string;
  statusCode: number;
  error: boolean;
  data: catEmbalaje[];  
}



  