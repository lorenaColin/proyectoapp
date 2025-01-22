import { Component, EventEmitter, inject, Input, OnChanges, OnInit } from '@angular/core';
import { ConceptsService } from '../../../services/concepts.service';
import { ConceptInterface } from '../../../interfaces/concept';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrl: './conceptos.component.scss'
})
export class ConceptosComponent implements OnInit {
  rows: any[] = []; 
  private conceptsService = inject(ConceptsService);
  @Input() typeProof!: string; 
  @Input() concetpEdit: ConceptInterface = {} as ConceptInterface;

  ngOnInit(): void {
    console.log('init', this.typeProof);
  }

  
  // ngOnChanges(): void {
  //   console.log('change',this.typeProof);
  // }

  addProductToTable(product: ConceptInterface): void {
    const index = this.rows.findIndex(row => row.idTemp === product.idTemp);
    (index !== -1) ? this.rows[index] = product :  this.rows.push(product);
  }

  removeRow(idTemp: number): void {
    const rowIndex = this.rows.findIndex(row => row.idTemp === idTemp);
  
    if (rowIndex !== -1) {
      this.rows.splice(rowIndex, 1);
  
      const formArray = this.conceptsService.getProductosFormArray();
      const formIdTemp = formArray.controls.findIndex(control => control.value.idTemp === idTemp);
  
      (formIdTemp !== -1) ? formArray.removeAt(formIdTemp) : '';
    }
  }

  editRow(idTemp: number): void {
    const formArray = this.conceptsService.getProductosFormArray();
    const formIndex = formArray.controls.findIndex(control => control.value.idTemp === idTemp);
    (formIndex !== -1) ? this.concetpEdit = Object.assign({}, formArray.at(formIndex).value) : console.error("Producto no encontrado");
  }
  
}
