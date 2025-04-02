import Decimal from "decimal.js";

export interface ConceptInterface {
    idTemp?: number;
    product_service_code: string;
    name_product: string;
    description: string;
    quantity: number;
    unit_value?: string;
    unit_price: string;
    unit_key?: string;
    identifier_number?: string;
    discount?: number;
    unit_description?:string;
    discount_percentage?: number;
    base: number;
    total_product: number;
    tax_object: string;
    
    // tax_iva?: string;
    // rate_iva?: string;
    // tax_ieps?: string;
    // rate_ieps?: string;
    // ret_iva?: string;
    // ret_isr?: string;
    // ret_ieps?: string;
    // tax_ish?: string;
    
    predial?: string;
    isUpdate?: boolean;
    
    traslados?: {
        base_iva?: string;
        valor_iva?: string;
        importe_iva?: string;
        base_ieps?: string;
        valor_ieps?: string;
        importe_ieps?: string;
        base_ish?: string;
        valor_ish?: string;
        importe_ish?: string;
    };
    
    retenciones?: {
        base_r_iva?: string;
        valor_r_iva?: string;
        importe_r_iva?: string;
        base_r_ieps?: string;
        valor_r_ieps?: string;
        importe_r_ieps?: string;
        base_r_isr?: string;
        valor_r_isr?: string;
        importe_r_isr?: string;
    };
  }
  

export interface ListConceptInterface {
    product_service_code: string;
    description: string;
    quantity: number;
    unit_price: string;
    discount?: number;
    total_product: Decimal;
    tax_object?: string;
    predial?: string;
}
export interface productInterface{
    id?: number;
    name_product: string;
    product_service_code: string;
    description: string;
    quantity: number;
    unit_value: string;
    unit_price: number;
    unit_key: string;
    discount: number;
    valorUnitario: number;
    base: number;
    total_product: number;
    tax_object: string;
    traslados: any[];
    retenidos: any[];
  } 
  export interface ApiResponseConcepto {
    message: string;
    statusCode: number;
    error: boolean;
    data: ConceptInterface[];  
  }
