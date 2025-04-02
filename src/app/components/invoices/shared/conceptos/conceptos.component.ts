import { Component, EventEmitter, inject, Input, OnChanges, OnInit } from '@angular/core';
import { ConceptsService } from '../../../services/concepts.service';
import { ConceptInterface, productInterface } from '../../../interfaces/concept';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrl: './conceptos.component.scss'
})
export class ConceptosComponent implements OnInit {
  rows: any[] = []; 
  public conceptsService = inject(ConceptsService);
  @Input() typeProof!: string; 
  @Input() concetpEdit: ConceptInterface = {} as ConceptInterface;

  ngOnInit(): void {
    console.log('init', this.typeProof);
    console.log(this.conceptsService.products())
  }

  
  // ngOnChanges(): void {
  //   console.log('change',this.typeProof);
  // }

  addProductToTable(product: ConceptInterface): void {
    const index = this.rows.findIndex(row => row.idTemp === product.idTemp);
    (index !== -1) ? this.rows[index] = product :  this.rows.push(product);
  }

  removeRow(id: number): void {
    let productosTemp = this.conceptsService.products().filter(p => p.id !== id);
    this.conceptsService.products.set(productosTemp);
    this.conceptsService.calculateTotals();
    this.conceptsService.setDataForm();
  }

  editRow(id: number): void {
    let producto = this.conceptsService.products().find(p => p.id === id) as productInterface;
    this.conceptsService.setConcept(producto);
    this.removeRow(id);
  }


  
}
