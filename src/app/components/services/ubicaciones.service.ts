import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConceptsService } from './concepts.service';
import { PATRON_RFC, PATRON_UBICACION_DESTINO, PATRON_UBICACION_ORIGEN } from '../../shared/utils/expressions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { ApiResponsepais, ubicacionInterface, ubicacionResponseInterface } from '../interfaces/ubicaciones.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ubicacionesService {
  private fb = inject(FormBuilder);
  constructor() { }
  validacionOrigen = PATRON_UBICACION_ORIGEN;
  validacionDestino = PATRON_UBICACION_DESTINO;
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ubicacion`;
  private paisesUrl = `${environment.apiUrl}/paises`;
  private direccionUrl = `${environment.apiUrl}/direccion`;



  getFormUbicacion(tipo: string): FormGroup {
    console.log(tipo);
    const idUbicacionPattern = tipo === 'ORIGEN' ? PATRON_UBICACION_ORIGEN : PATRON_UBICACION_DESTINO;
    return this.fb.group({
      rfc: ['', [Validators.required, Validators.pattern(PATRON_RFC)]],
      // idUbicacion: ['', tipo === 'ORIGEN' ? [Validators.required] : []], 
      idUbicacion: ['',
        [Validators.pattern(idUbicacionPattern)]
      ],
      NombreRemitenteDestinatario: ['', [Validators.maxLength(254), Validators.minLength(1)]],
      numRegIdTrib: ['', [Validators.maxLength(40), Validators.minLength(6)]],
      residenciaFiscal: ['', []],
      tipoUbicacion: [tipo, []],
      domicilio: ['', []],
      pais: ['', []],
      codigoPostal: ['', []],
      estado: ['', [ Validators.maxLength(30), Validators.minLength(1)]],
      municipio: ['', []],
      localidad: ['', []],
      colonia: ['', []],
      calle: ['', []],
      numeroExterior: ['', []],
      numeroInterior: ['', []],
      referencia: ['', []],
    });
  }

  getAllubicacion(): Observable<ubicacionResponseInterface> {
    return this.http.get<ubicacionResponseInterface>(this.apiUrl);
  }
  createUbicacion(ubicacion: ubicacionInterface): Observable<ubicacionResponseInterface> {
    return this.http.post<ubicacionResponseInterface>(this.apiUrl, ubicacion);
  }
  getubicacionById(id: number): Observable<ubicacionResponseInterface> {
    return this.http.get<ubicacionResponseInterface>(`${this.apiUrl}/${id}`);
  }
  updateubicacion(id: number, ubicacion: ubicacionInterface): Observable<ubicacionResponseInterface> {
    return this.http.put<ubicacionResponseInterface>(`${this.apiUrl}/${id}`, ubicacion);
  }

  getPaises(): Observable<string[]> {
    return this.http.get<string[]>(this.paisesUrl);
  }

  deleteubicacion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  // getDireccion(codigoPostal: string): Observable<any> {
  //   return this.http.get(`${this.direccionUrl}/${codigoPostal}`);
  // }




   getDireccion(codigoPostal: string): Observable<any> {
      return this.http.get(`${this.direccionUrl}/${codigoPostal}`);
    }
  
     getAllPais(): Observable<ApiResponsepais> {
        return this.http.get<ApiResponsepais>(this.paisesUrl);
      }
}
