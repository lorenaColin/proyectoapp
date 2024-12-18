

export interface UserResponseInterface {
    message:    string;
    statusCode: number;
    error:      boolean;
    data:       UserLoginInterface;
}

export interface UserLoginInterface {
    type:     string;
    verified: string;
    token:    string;
}

export interface VerifyCodeResponseInterface {
    message:    string;
    statusCode: number;
    error:      boolean;
    data:    Data;
}

export interface Data {
    code: string[];
}


export interface TokenRefreshResponseInterface {
    message:    string;
    statusCode: number;
    error:      boolean;
    data:       any[];
}