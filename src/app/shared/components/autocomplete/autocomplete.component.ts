import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface AutocompleteItem {
  label: string;
  value: any;
}

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  @Input() listItems: AutocompleteItem[] = [];
  @Input() formGroup!: FormGroup; 
  @Input() formControlName!: string; 
  @Output() itemSelected = new EventEmitter<any>();

  filteredItems: AutocompleteItem[] = [];
  selectedIndex: number = -1;
  query: string = '';

  ngOnInit(): void {
    this.filteredItems = this.listItems;
  }

  onInput(event: any): void {
    const query = event.target.value.toLowerCase();
    this.query = query;
    if (query.length >= 2) {
      this.filteredItems = this.listItems.filter(
        (item) => item.label.toLowerCase().includes(query)
      );
    } else {
      this.filteredItems = [];
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      if (this.selectedIndex < this.filteredItems.length - 1) {
        this.selectedIndex++;
      }
      event.preventDefault();  
    } else if (event.key === 'ArrowUp') {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      event.preventDefault();  
    } else if (event.key === 'Enter') {
      if (this.selectedIndex >= 0) {
        this.selectItem(this.filteredItems[this.selectedIndex]);
      }
    }
  }

  selectItem(item: AutocompleteItem): void {
    // Establecer el valor seleccionado en el formulario (usar el value)
    this.formGroup.get(this.formControlName)?.setValue(item.value);
    this.itemSelected.emit(item.value);  // Emitir el value
    this.filteredItems = [];  // Limpiar la lista de resultados filtrados
    this.selectedIndex = -1;  // Reiniciar el índice seleccionado
  }
  

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.autocomplete-wrapper')) {
      this.filteredItems = [];
    }
  }
}
