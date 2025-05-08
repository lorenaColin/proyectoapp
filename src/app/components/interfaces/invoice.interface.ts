export interface invoiceDetailInterface {
    id: number;
    serie: string;
    id_company: string;
   
   date: string;
   way_to_pay: string;
   payment_method: string;
   payment_conditions: string;
   subtotal: string;
   discount: string;
   currency: string;
   change_type: string;
   folio: string;
   payment_terms: string;
   total: string;
   export: string;
   invoice_type: string;
   type_receipt: string;
   invoice_usage: string;
   uuid: string;
   timbre_date: string;
   cfdi_seal: string;
   sat_seal: string;
   rfc_pac: string;
   receiver_id: string;
   creation_date: string;
   type_relation: string;
   uuid_company: string;
   xml_filename:string;
  }
  
  export interface companyDetailResponseInterface {
    message: string;
    statusCode: number;
    error: boolean;
    data: invoiceDetailInterface;  // Los datos reales de la empresa están en "data"
  }
  
    export interface invoiceDetailListResponseInterface {
      message: string;
      statusCode: number;
      error: boolean;
      data: invoiceDetailInterface[];
    }