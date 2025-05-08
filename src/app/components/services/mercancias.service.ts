import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { CompanyListResponseInterface, CompanyInterface, CompanyResponseInterface } from '../interfaces/company.interface';
import { MercanciaInterface, MercanciaListResponseInterface, MercanciaResponseInterface, CatProdServCP, ApiResponse, ApiResponseClave, ApiResponseMatPeligroso, ApiResponseEmbalaje, ApiResponseMercnaica } from '../interfaces/mercancias.interface';

@Injectable({
  providedIn: 'any'
})
export class MercanciasService {


  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/mercancia`;
  private prodServApiUrl = `${environment.apiUrl}/prodservcp`;
  private catClaveUnidadApiUrl = `${environment.apiUrl}/catClaveUnidad`;
  private catMatPeligrosoApiUrl = `${environment.apiUrl}/catMatpeligroso`;
  private catEmbalajeApiUrl = `${environment.apiUrl}/catEmbalaje`;
  private ConceptosApiUrl = `${environment.apiUrl}/mercanciaquery`;



  

  getAllmercancias(): Observable<MercanciaListResponseInterface> {
    return this.http.get<MercanciaListResponseInterface>(this.apiUrl);
  }
   getAllMercanciaQuery(query: string): Observable<ApiResponseMercnaica> {
      const url = `${this.ConceptosApiUrl}?termino=${query}`;
      return this.http.get<ApiResponseMercnaica>(url);
    }

  createmercancias(mercancias: MercanciaInterface): Observable<MercanciaResponseInterface> {
    return this.http.post<MercanciaResponseInterface>(this.apiUrl, mercancias);
  }
  getmercanciasById(id: number): Observable<MercanciaResponseInterface> {
    return this.http.get<MercanciaResponseInterface>(`${this.apiUrl}/${id}`);
  }
  updatemercancias(id: number, mercancias: MercanciaInterface): Observable<MercanciaResponseInterface> {
    return this.http.put<MercanciaResponseInterface>(`${this.apiUrl}/${id}`, mercancias);
  }

  // Eliminar un mercancias
  deletemercancias(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);

  }
  // getAllProductsAndServices(): Observable<CatProdServCP[]> {
  //   return this.http.get<CatProdServCP[]>(this.prodServApiUrl);  
  // }

  getAllProductsAndServices(query: string): Observable<ApiResponse> {
        const url = `${this.prodServApiUrl}?termino=${query}`;
        return this.http.get<ApiResponse>(url);
      }
  // getAllcatClaveUnidad(): Observable<ApiResponseClave> {
  //   return this.http.get<ApiResponseClave>(this.catClaveUnidadApiUrl);
  // }
  getAllcatClaveUnidad(query: string): Observable<ApiResponseClave> {
    const url = `${this.catClaveUnidadApiUrl}?termino=${query}`;
    return this.http.get<ApiResponseClave>(url);
  }
  // getAllcatMatPeligroso(): Observable<ApiResponseMatPeligroso> {
  //   return this.http.get<ApiResponseMatPeligroso>(this.catMatPeligrosoApiUrl);
  // }
  getAllcatMatPeligroso(query: string): Observable<ApiResponseMatPeligroso> {
    const url = `${this.catMatPeligrosoApiUrl}?termino=${query}`;
    return this.http.get<ApiResponseMatPeligroso>(url);
  }
  // getAllcatEmbalaje(): Observable<ApiResponseEmbalaje> {
  //   return this.http.get<ApiResponseEmbalaje>(this.catEmbalajeApiUrl);
  // }
  getAllcatEmbalaje(query: string): Observable<ApiResponseEmbalaje> {
    const url = `${this.catEmbalajeApiUrl}?termino=${query}`;
    return this.http.get<ApiResponseEmbalaje>(url);
  }
  
}
