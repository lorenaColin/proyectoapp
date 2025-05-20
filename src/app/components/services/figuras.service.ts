import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConceptsService } from './concepts.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { ApiResponseFiguras, ApiResponsepais, FigurasInterface, FigurasListResponseInterface, FigurasResponseInterface } from '../interfaces/figuras.interface';

@Injectable({
  providedIn: 'root'
})
export class figurasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/figuras`;
  private paisesUrl = `${environment.apiUrl}/paisesF`;
  private direccionUrl = `${environment.apiUrl}/direccionF`;
  private ConceptosApiUrl = `${environment.apiUrl}/figurasquery`;




  createInsurance(
    insurance: FigurasInterface
  ): Observable<FigurasResponseInterface> {
    return this.http.post<FigurasResponseInterface>(this.apiUrl, insurance);
  }

  updateInsurance(
    id: number,
    formData: FigurasInterface
  ): Observable<FigurasResponseInterface> {
    return this.http.put<FigurasResponseInterface>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }

  getAllFiguras(): Observable<FigurasResponseInterface> {
    return this.http.get<FigurasResponseInterface>(this.apiUrl);
  }

  getInsurance(): Observable<FigurasListResponseInterface> {
    return this.http.get<FigurasListResponseInterface>(this.apiUrl);
  }
  createfiguras(figuras: FigurasInterface): Observable<FigurasResponseInterface> {
    return this.http.post<FigurasResponseInterface>(this.apiUrl, figuras);
  }
  getfigurasById(id: number): Observable<FigurasResponseInterface> {
    return this.http.get<FigurasResponseInterface>(`${this.apiUrl}/${id}`);
  }
  updatefiguras(id: number, figuras: FigurasInterface): Observable<FigurasResponseInterface> {
    return this.http.put<FigurasResponseInterface>(`${this.apiUrl}/${id}`, figuras);
  }

  //   getPaises(): Observable<string[]> {
  //     return this.http.get<string[]>(this.paisesUrl); 
  // }

  deletefiguras(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getDireccion(codigoPostal: string): Observable<any> {
    return this.http.get(`${this.direccionUrl}/${codigoPostal}`);
  }

  //  getAllPais(): Observable<ApiResponsepais> {
  //     return this.http.get<ApiResponsepais>(this.paisesUrl);
  //   }

  getAllPais(query: string): Observable<ApiResponsepais> {
    const url = `${this.paisesUrl}?termino=${query}`;
    return this.http.get<ApiResponsepais>(url);
  }

  getAllFigurasQuery(query: string): Observable<ApiResponseFiguras> {
    const url = `${this.ConceptosApiUrl}?termino=${query}`;
    return this.http.get<ApiResponseFiguras>(url);
  }

}
