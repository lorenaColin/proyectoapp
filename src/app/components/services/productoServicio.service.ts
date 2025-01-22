import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { CompanyListResponseInterface, CompanyInterface, CompanyResponseInterface } from '../interfaces/company.interface';
import { ProductInterface, ProductListResponseInterface, ProductResponseInterface } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'any'
})
export class productoServicio {


  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

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

  // Eliminar un producto
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
