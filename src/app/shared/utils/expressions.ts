
export const PATRON_PHONE = /^\d{10}|\d{13}$/;
export const PATRON_CONTRASENA =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
export const PATRON_RFC = /^([A-Z&Ññ]{3}|[A-Z][AEIOU][A-Z]{2})\d{2}((01|03|05|07|08|10|12)(0[1-9]|[12]\d|3[01])|02(0[1-9]|[12]\d)|(04|06|09|11)(0[1-9]|[12]\d|30))([A-Z0-9]{2}[0-9A])$/i;
export const PATRON_EMAIL = /^(?!\.)[a-zA-Z0-9._%+-]+(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
export const PATRON_CURP = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/i;
export const VALOR_IVA_T = /^(0|16)$/;
export const PATRON_UUID = '^[a-f0-9A-F]{8}-[a-f0-9A-F]{4}-[a-f0-9A-F]{4}-[a-f0-9A-F]{4}-[a-f0-9A-F]{12}$';


// Expresiones de carta Porte
export const PATRON_UBICACION = /OR|DE[0-9]{6}$/;
export const PATRON_PLACA = '^[A-Za-z0-9]{5,7}$';

export const PATRON_UBICACION_ORIGEN = /OR[0-9]{6}$/;
export const PATRON_UBICACION_DESTINO = /DE[0-9]{6}$/;
export const PATRON_PLACAVM = /[^(?!.*\s)-]{5,7}/; 
export const PATRON_ANIO = /^(19[0-9]{2}|20[0-9]{2})$/; 
export const DIMENSIONES_REGEX = /^([0-9]{1,3}\/){2}[0-9]{1,3}(cm|plg)$/;
export const DECIMALES = /^\d+(\.\d{1,2})?$/;
export const DECIMALESPRODU = /^\d{1,24}(\.\d{1,6})?$/;


/*
const PATRON_REGULAR_20 = '([A-Z]|[a-z]|[0-9]| |Ñ|ñ|!|&quot;|%|&amp;|&apos;|´|-|:|;|&gt;|=|&lt;|@|_|,|\{|\}|`|~|á|é|í|ó|ú|Á|É|Í|Ó|Ú|ü|Ü){1,20}';
const PATRON_REGULAR_100 = '([A-Z]|[a-z]|[0-9]| |Ñ|ñ|!|&quot;|%|&amp;|&apos;|´|-|:|;|&gt;|=|&lt;|@|_|,|\{|\}|`|~|á|é|í|ó|ú|Á|É|Í|Ó|Ú|ü|Ü){1,100}';
const PATRON_REGULAR_1000 = '([A-Z]|[a-z]|[0-9]| |Ñ|ñ|!|&quot;|%|&amp;|&apos;|´|-|:|;|&gt;|=|&lt;|@|_|,|\{|\}|`|~|á|é|í|ó|ú|Á|É|Í|Ó|Ú|ü|Ü){1,1000}';
const PATRON_RFC = /^[A-Z&amp;Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/;
const PATRON_CURP = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
const PATRON_CORREO = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
const PATRON_ANTIGUEDAD_SEMANA = /^[P]{1}[1-9][0-9]{0,3}[W]{1}$/i;
const PATRON_ANTIGUEDAD_PERIODO = /^P(([1-9][0-9]?Y)?([1-9]|1[012])M)?([0]|[1-9]|[12][0-9]|3[01])D$/i;
const PATRON_CONFIRMACION = '[0-9a-zA-Z]{5}';
const PATRON_WEBSITE = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \?=.-]*)*\/?$/;
const PATRON_TELEFONO = /^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/;
const PATRON_CONTRASENA = /^(?=.*\d)(?=.*[¡!$%&/()=¿?*{}_;:.,@#<>-])(?=.*[A-Z])\S{8,16}$/;
const PATRON_NUMEROS_SEPARADOS = /^[0-9]{1,6}([ ]*[,]{1}[ ]*[0-9]{0,6})*$/;
const PATRON_NUMERICO_POSITIVO = /^[0-9]+$/;
const PATRON_DECIMAL = /^[0-9]+[.]*[0-9]*$/;
const PATRON_RAZON_SOCIAL = /^[^\|]{1,254}$/;
const PATRON_NUMERO_PEDIMENTO = /^[0-9]{2}  [0-9]{2}  [0-9]{4}  [0-9]{7}$/;
const PATRON_USUARIO = /^[a-zA-Z0-9._@-]+$/;


*/