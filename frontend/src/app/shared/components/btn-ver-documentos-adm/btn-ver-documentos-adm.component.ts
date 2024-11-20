import { Component , Output, EventEmitter, Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { GestDocStudentsComponent } from '../gest-doc-students/gest-doc-students.component';

@Component({
  selector: 'app-btn-ver-documentos-adm',
  templateUrl: './btn-ver-documentos-adm.component.html',
  styleUrls: ['./btn-ver-documentos-adm.component.css']
})
export class BtnVerDocumentosAdmComponent {
  @Output() openModalEvent = new EventEmitter<void>();

  onOpenModal() {
    this.openModalEvent.emit();


  }

  @Input() aspiranteId!: string; // Recibe el ID del aspirante desde el componente padre
  @Output() aspiranteIdEvent = new EventEmitter<string>();

  viewDocuments() {

    this.aspiranteIdEvent.emit(this.aspiranteId); // Emitir el ID del aspirante al componente padre
    this.openModalEvent.emit(); // Emitir el evento para abrir el modal
  }


  handleButtonClick() {

    this.aspiranteIdEvent.emit(this.aspiranteId); // Emitir el ID
    this.openModalEvent.emit(); // Abrir el modal
}

  
}
