import { Component, inject, Input, OnInit } from '@angular/core';
import { CompanyService } from '../../../services/company.service';
import {
  CompanyListInterface,
  CompanyInterface,
} from '../../../interfaces/company.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent implements OnInit {
  showLoader = false;
  public listadoEmpresas: CompanyListInterface[] = [];
  private companyService = inject(CompanyService);
  private router = inject(Router);
  empresas: CompanyInterface[] = [];
  @Input() empresa: CompanyInterface = {} as CompanyInterface;
  filteredCompanies: any[] = [];

  ngOnInit(): void {
    this.showLoader = true;
    this.companyService.listCompany().subscribe((response) => {
      this.showLoader = false;
      this.filteredCompanies = response.data;

      let { error, data } = response;
      if (error) return console.error('Error al obtener las empresas');
      this.listadoEmpresas = data;
    });
  }
  setCompany(id: string): void {
    localStorage.setItem('company', id);
    this.router.navigate(['dashboard']);
  }

  editCompany(id: string): void {
    this.showLoader = true;
    this.companyService.getCompanyById(id).subscribe((response) => {
      this.empresa = response.data;
      console.log(this.empresa);
      this.showLoader = false;
    });
  }

  respuesta(respuesta: CompanyListInterface): void {
    this.listadoEmpresas.push(respuesta);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.filteredCompanies = this.empresas.filter(
      (empresa) =>
        empresa.name.toLowerCase().includes(filterValue) ||
        empresa.rfc.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredCompanies);
  }
}
