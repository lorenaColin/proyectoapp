import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConceptsService } from './concepts.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { FigurasInterface, FigurasResponseInterface } from '../interfaces/figuras.interface';

@Injectable({
    providedIn: 'root'
})
export class figurasService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/figuras`;
    private paisesUrl = `${environment.apiUrl}/paises`;
    private direccionUrl = `${environment.apiUrl}/direccion`;
  
  

   


  getAllFiguras(): Observable<FigurasResponseInterface> {
    return this.http.get<FigurasResponseInterface>(this.apiUrl);
  }
  createfiguras(figuras: FigurasInterface): Observable<FigurasResponseInterface> {
    return this.http.post<FigurasResponseInterface>(this.apiUrl, figuras);
  }
  getfigurasById(id: number): Observable<FigurasResponseInterface> {
    return this.http.get<FigurasResponseInterface>(`${this.apiUrl}/${id}`);
  }
  updatefiguras(id: number, figuras:FigurasInterface): Observable<FigurasResponseInterface> {
    return this.http.put<FigurasResponseInterface>(`${this.apiUrl}/${id}`, figuras);
  }
 
  getPaises(): Observable<string[]> {
    return this.http.get<string[]>(this.paisesUrl); 
}

  deletefiguras(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getDireccion(codigoPostal: string): Observable<any> {
    return this.http.get(`${this.direccionUrl}/${codigoPostal}`);
  }


}
