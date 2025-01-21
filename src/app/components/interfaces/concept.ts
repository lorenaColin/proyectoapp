import Decimal from "decimal.js";

export interface ConceptInterface{
    idTemp? : number;
    product_service_code: string;
    name_product: string;
    description: string;
    quantity: number;
    unit_value?: string;
    unit_price: string;
    unit_key?: string;
    identification_number?: string;
    discount?: number;
    discount_percentage?: number;
    base: Decimal;
    total_product: Decimal;
    tax_object: string;
    tax_iva? : string;
    rate_iva? : string;
    tax_ieps? : string;
    rate_ieps? : string;
    ret_iva? : string;
    ret_isr? : string;
    ret_ieps? : string;
    tax_ish? : string;
    }
