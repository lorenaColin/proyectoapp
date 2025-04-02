import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { CompanyListResponseInterface, CompanyInterface, CompanyResponseInterface } from '../interfaces/company.interface';
import { ApiResponseConceptos, ApiResponseProducto, ApiResponseUnidad, ProductInterface, ProductListResponseInterface, ProductResponseInterface } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'any'
})
export class productoServicio {


  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;
  private catproductApiUrl = `${environment.apiUrl}/catProductos`;
  private ConceptosApiUrl = `${environment.apiUrl}/conceptos`;

  private catunidadApiUrl = `${environment.apiUrl}/catUnidad`;

  


  getAllProducts(): Observable<ProductListResponseInterface> {
    return this.http.get<ProductListResponseInterface>(this.apiUrl);
  }
  createProduct(product: ProductInterface): Observable<ProductResponseInterface> {
    return this.http.post<ProductResponseInterface>(this.apiUrl, product);
  }
  getProductById(id: string): Observable<ProductResponseInterface> {
    return this.http.get<ProductResponseInterface>(`${this.apiUrl}/${id}`);
  }
  updateProduct(id: string, product: ProductInterface): Observable<ProductResponseInterface> {
    return this.http.put<ProductResponseInterface>(`${this.apiUrl}/${id}`, product);
  }
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  // getAllCatProducto(): Observable<ApiResponseProducto> {
  //   return this.http.get<ApiResponseProducto>(this.catproductApiUrl);
  // }
  getAllCatProducto(query: string): Observable<ApiResponseProducto> {
    const url = `${this.catproductApiUrl}?termino=${query}`;
    return this.http.get<ApiResponseProducto>(url);
  }
  getAllConceptos(query: string): Observable<ApiResponseConceptos> {
    const url = `${this.ConceptosApiUrl}?termino=${query}`;
    return this.http.get<ApiResponseConceptos>(url);
  }
  
  // getAllCatUnidad(): Observable<ApiResponseUnidad> {
  //   return this.http.get<ApiResponseUnidad>(this.catunidadApiUrl);
  // }
  getAllCatUnidad(query: string): Observable<ApiResponseUnidad> {
    const url = `${this.catunidadApiUrl}?termino=${query}`;
    return this.http.get<ApiResponseUnidad>(url);
  }
  
}
