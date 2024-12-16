export interface CompanyInterface {
    name:                  string;
    rfc:                   string;
    curp:                  string;
    employee_registration: string;
    email:                 string;
    phone:                 string;
    cp:                    string;
    regime:                string;
    address:               string;
}

export interface CompanyResponseInterface {
    message:    string;
    statusCode: number;
    error:      boolean;
    data:       CompanysInterface;
}

export interface CompanysInterface {
    name:                  string;
    address:               string;
    cp:                    string;
    curp:                  string;
    rfc:                   string;
    regime:                string;
    employee_registration: string;
    email:                 string;
    phone:                 string;
    id:                    string;
    updated_at:            Date;
    created_at:            Date;
}

export interface CompanyListResponseInterface {
    message:    string;
    statusCode: number;
    error:      boolean;
    data:       CompanyListInterface;
}

export interface CompanyListInterface {
    id:                    string;
    name:                  string;
    address:               string;
    cp:                    string;
    curp:                  string;
    status:                string;
    rfc:                   string;
    regime:                string;
    employee_registration: string;
    type:                  string;
    email:                 string;
    phone:                 string;
    logo:                  string;
    id_usr_create:         number;
    created_at:            Date;
    updated_at:            Date;
}