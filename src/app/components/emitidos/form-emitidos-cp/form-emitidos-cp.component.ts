import { Component } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { InvoicesService } from '../../services/invoices.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { invoiceDetailInterface } from '../../interfaces/invoice.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'app-form-emitidos-cp',
  templateUrl: './form-emitidos-cp.component.html',
  styleUrl: './form-emitidos-cp.component.scss'
})
export class FormEmitidosCPComponent {
  showNuevoComprobante = false;
  showDescargarEnviar = false;
  showLoader = false;

  constructor(private router: Router, private companyService: CompanyService, private invoicesService: InvoicesService) {
    this.obtenerNombreEmpresa(); // Obtener la información de la empresa
  }

  toggleNuevoComprobante() {
    this.showNuevoComprobante = !this.showNuevoComprobante;
  }

  toggleDescargarEnviar() {
    this.showDescargarEnviar = !this.showDescargarEnviar;
  }

  nuevaFactura() {
    this.router.navigate(['invoices/traslado']);
  }
  empresaNombre: string = ''; // Nombre de la empresa
  facturas: any[] = []; // Aquí van las facturas
  companyId: string = '';
  obtenerNombreEmpresa() {
    this.showLoader = true;
    this.companyService.listCompany().subscribe({
      next: (response) => {
        const uuidCompany = localStorage.getItem('company');
        const companies = response.data ?? [];

        const company = companies.find(c => c.id === uuidCompany);
        this.empresaNombre = company?.name ?? 'Empresa';

        if (uuidCompany) {
          this.companyId = uuidCompany;
          this.obtenerFacturas(uuidCompany); // ✅ ahora sí usa el uuid seleccionado
        } else {
          console.error('No se encontró empresa con ese UUID en localStorage');
          this.showLoader = false;

        }
      },
      error: (err) => {
        console.error('Error al obtener empresa', err);
        this.showLoader = false;

      }
    });
  }

  obtenerFacturas(uuidCompany: string): void {
    this.invoicesService.getInovicebyId(uuidCompany).subscribe({
      next: (response) => {
        const todas = response.data ?? [];

        // Aquí pones los console.log de depuración:
        console.log('UUID localStorage (empresa actual):', uuidCompany);
        console.log('UUIDs en facturas recibidas:', todas.map(f => f.uuid_company));

        // Tu filtro, ahora con trim() por si hubiera espacios:
        this.facturas = todas.filter(f =>
          (f.invoice_type === 'T') &&
          f.uuid_company?.trim() === uuidCompany?.trim()

        );
        this.showLoader = false;

        console.log('Facturas filtradas para esta empresa:', this.facturas);
      },
      error: (error) => {
        console.error('Error al obtener facturas:', error);
        this.showLoader = false;

      }
    });
  }

  copiarTabla() {
    const tabla = document.querySelector('table')!;
    const tablaClon = tabla.cloneNode(true) as HTMLElement;

    tablaClon.querySelectorAll('tr').forEach(fila => {
      fila.lastElementChild?.remove();
    });

    const range = document.createRange();
    range.selectNode(tablaClon);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand('copy');
    alert('Tabla copiada ');
  }


  exportarExcel() {
    const tabla = document.querySelector('table')!;
    const tablaClon = tabla.cloneNode(true) as HTMLElement;

    tablaClon.querySelectorAll('tr').forEach(fila => {
      fila.lastElementChild?.remove();
    });

    const html = tablaClon.outerHTML.replace(/ /g, '%20');
    const url = 'data:application/vnd.ms-excel,' + html;
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'facturas.xls';
    enlace.click();
  }


  exportarPDF() {
    const doc = new jsPDF();

    const columnas = ["Folio", "Fecha", "Serie", "RFC", "Total"];
    const filas = this.facturas.map(f => [f.folio, f.date, f.serie, f.rfc_pac, f.total]);

    autoTable(doc, {
      head: [columnas],
      body: filas,
      styles: { fontSize: 8 },
    });

    doc.save('facturas.pdf');
  }

  imprimirTabla() {
    const tabla = document.querySelector('table')!;
    const tablaClon = tabla.cloneNode(true) as HTMLElement;

    tablaClon.querySelectorAll('tr').forEach(fila => {
      fila.lastElementChild?.remove();
    });

    const printContents = tablaClon.outerHTML;
    const popupWin = window.open('', '_blank', 'width=800,height=600');
    popupWin?.document.open();
    popupWin?.document.write(`
      <html>
        <head>
          <title>Imprimir Tabla</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #ccc; }
          </style>
        </head>
        <body onload="window.print(); window.close();">${printContents}</body>
      </html>
    `);
    popupWin?.document.close();
  }

  onDownloadXml(f: invoiceDetailInterface) {
    this.invoicesService.downloadXml(f.id).subscribe({
      next: blob => {
        // Detectar si es JSON por error
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result as string);
            console.error('Error del servidor:', json);
          } catch {
            saveAs(blob, f.xml_filename);
          }
        };
        reader.readAsText(blob);
      },
      error: err => console.error('Error descarga XML', err)
    });
  }
}
