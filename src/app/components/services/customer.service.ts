import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { CustomerListInterface, CustomerResponseInterface, CustomersInterface } from '../interfaces/customers.interface';

@Injectable({
  providedIn: 'any'
})
export class CustomerService {

  constructor(
          private http: HttpClient
      ){}
      private urlCustomers = `${environment.apiUrl}/customers`;
      private urlCompanies = `${environment.apiUrl}/companies`;

      createCustomer(customer: CustomersInterface): Observable<CustomerResponseInterface> {
          return this.http.post<CustomerResponseInterface>(this.urlCustomers, customer);
      }

      getCustomers(): Observable<CustomerListInterface> {
        return this.http.get<CustomerListInterface>(this.urlCustomers);
      }

      getCustomerById(id: number): Observable<any> {
        return this.http.get<any>(`${this.urlCustomers}/${id}`);
      }
      getCompanyInfo(companyId: string): Observable<any> {
        return this.http.get<any>(`${this.urlCompanies}/${companyId}`);
      }

      updateCustomer(id: number, formData: CustomersInterface): Observable<CustomerResponseInterface> {
        return this.http.put<CustomerResponseInterface>(`${this.urlCustomers}/${id}`, formData);
      }  
}
