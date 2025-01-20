import { Component, inject, Input } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import {
  CustomerListInterface,
  CustomerResponseInterface,
  CustomersInterface,
} from '../../interfaces/customers.interface';
import { RegimenInterface } from '../../../shared/interfaces/shared.interface';
import { UtilsService } from '../../../shared/services/utils.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  private customerService = inject(CustomerService);
  private utilsService = inject(UtilsService);
  constructor() {}
  filteredCustomer: any[] = [];
  clientes: CustomersInterface[] = [];
  @Input() cliente: CustomersInterface = {} as CustomersInterface;
  showLoader = false;
  listadoRegimen: RegimenInterface[] = [];
  ngOnInit() {
    this.showLoader = true;
    this.customerService.getCustomers().subscribe((response) => {
      this.showLoader = false;
      this.clientes = response.data;
      this.filteredCustomer = response.data;
      console.log(this.clientes);
    });
    this.listadoRegimen = this.utilsService.getRegimenSat('');
  }

  editCustomer(id: number): void {
    this.showLoader = true;
    this.customerService.getCustomerById(id).subscribe((response) => {
      this.cliente = response.data;
      console.log(this.cliente);
      this.listadoRegimen = this.utilsService.getRegimenSat(this.cliente.rfc);
      this.showLoader = false;
    });
  }
  responseCustomer(response: CustomerResponseInterface): void {
    this.showLoader = true;
    this.customerService.getCustomers().subscribe((response) => {
      this.clientes = response.data;
      this.filteredCustomer = response.data;
      this.showLoader = false;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.filteredCustomer = this.clientes.filter(
      (cliente) =>
        cliente.name.toLowerCase().includes(filterValue) ||
        cliente.rfc.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredCustomer);
  }

  LISTADORFCSGENERICOS = ['XAXX010101000', 'XEXX010101000'];
}
