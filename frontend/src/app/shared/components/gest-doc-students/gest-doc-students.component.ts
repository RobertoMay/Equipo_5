import { Component } from '@angular/core';

@Component({
  selector: 'app-gest-doc-students',
  templateUrl: './gest-doc-students.component.html',
  styleUrls: ['./gest-doc-students.component.css']
})
export class GestDocStudentsComponent {


  isModalOpen = false;
  studentName = 'Angela Chin';  // Esto es solo un ejemplo

/*
  isAccepted: boolean = false; // Controla si se ha aceptado un documento
  studentDocuments: any[] = []; // Lista de documentos de estudiantes
  tutorDocuments: any[] = []; // Lista de documentos de tutores
  documentNames: string[] = []; // Nombres de los documentos de estudiantes
  tutorDocumentNames: string[] = []; // Nombres de los documentos de tutores
  statusTranslation: { [key: string]: string } = {}; // Traducción de los estados de documentos
  comments: string[] = []; // Comentarios
  */



  isAccepted: boolean = false; // Controla si se ha aceptado un documento

  studentDocuments = [
    { status: 'approved' },
    { status: 'pending' }
  ];

  tutorDocuments = [
    { status: 'rejected' },
    { status: 'approved' }
  ];

  documentNames = ['Documento de Identidad', 'Acta de Nacimiento'];
  tutorDocumentNames = ['Identificación del Tutor', 'Comprobante de Domicilio'];

  statusTranslation: { [key: string]: string } = {
    approved: 'Aprobado',
    rejected: 'Rechazado',
    pending: 'Pendiente'
  };
  
  comments = ['Falta corregir el acta de nacimiento.', 'Todo está en orden.'];


  // Método para obtener la clase de estado (puedes adaptar esta función según necesites)
  getBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }



  // Método para abrir/cerrar el modal
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }


}
