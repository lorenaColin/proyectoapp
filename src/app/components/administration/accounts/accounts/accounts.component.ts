import { Component, inject, OnInit } from '@angular/core';
import { CompanyService } from '../../../services/company.service';
import { CompanyListInterface } from '../../../interfaces/company.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent implements OnInit {
  showLoader = false;
  public listadoEmpresas: CompanyListInterface[] = [];
  private companyService = inject(CompanyService);
  private router = inject(Router);

  ngOnInit(): void {
    this.companyService.listCompany().subscribe((response) => {
      let { error, data } = response;
      if(error) return console.error('Error al obtener las empresas');
      this.listadoEmpresas = data;
    });
  }

  setCompany(id: string): void {
    localStorage.setItem('company', id);
    this.router.navigate(['dashboard'])
  }

  respuesta(respuesta: CompanyListInterface ):void{
    this.listadoEmpresas.push(respuesta);
  }
}
