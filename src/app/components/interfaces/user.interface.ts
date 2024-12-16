
export interface UserResponseInterface {
    message:    string;
    statusCode: number;
    error:      boolean;
    data:       Data;
}

export interface Data {
    user:  UserInterface;
    token: string;
}

export interface UserInterface {
    name:            string;
    email:           string;
    type:            string;
    ultima_conexion: Date;
    updated_at:      Date;
    created_at:      Date;
    id:              number;
}

export interface UserFormInterface {
    name:            string;
    email:           string;
    type:            string;
    password:        string;
}

export interface codeUserFormInterface {
    code: string;
}

export interface CodeUserResponseInterface {
    message:    string;
    statusCode: number;
    error:      boolean;
    data:       any[];
}

