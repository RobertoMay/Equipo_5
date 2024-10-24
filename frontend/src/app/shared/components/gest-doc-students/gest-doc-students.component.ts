import { Component } from '@angular/core';

@Component({
  selector: 'app-gest-doc-students',
  templateUrl: './gest-doc-students.component.html',
  styleUrls: ['./gest-doc-students.component.css']
})
export class GestDocStudentsComponent {


  isModalOpen = true;
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
    { status: 'approved',iconStatus: ''  },
    { status: 'pending', iconStatus: ''  }
  ];

  tutorDocuments = [
    { status: 'rejected', iconStatus: ''  },
    { status: 'approved' , iconStatus: '' }
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
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      case 'pending':
        return 'badge-default'; // Clase para documentos pendientes o por defecto
      default:
        return 'badge-default';
    }

    /*switch (status) {
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }*/
  }



  // Método para abrir/cerrar el modal
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  newComment: string = ''; // Nuevo comentario a añadir

  // Método para aceptar un documento
  acceptDocument(index: number, isTutor: boolean = false) {
    // Lógica para aceptar el documento
    if (isTutor) {
      this.tutorDocuments[index].status = 'approved';
      this.tutorDocuments[index].iconStatus = 'approved'; 
    } else {
      this.studentDocuments[index].status = 'approved';
      this.studentDocuments[index].iconStatus = 'approved'; 
    }
  }
  
  // Método para rechazar un documento
  rejectDocument(index: number, isTutor: boolean = false) {
    // Lógica para rechazar el documento
    if (isTutor) {
      this.tutorDocuments[index].status = 'rejected';
this.tutorDocuments[index].iconStatus = 'rejected'
    } else {
      this.studentDocuments[index].status = 'rejected';
      this.studentDocuments[index].iconStatus = 'rejected'
    }
  }
  
  // Método para añadir un comentario
  addComment() {
    if (this.newComment) {
      this.comments.push(this.newComment);
      this.newComment = ''; // Limpiar el campo de entrada
    }
  }

  deleteComment(index: number): void {
    this.comments.splice(index, 1);
  }


// Método para aceptar todos los documentos
acceptAll(): void {
  // Aceptar todos los documentos del alumno
  this.studentDocuments.forEach((document, index) => {
    this.acceptDocument(index);
  });

  // Aceptar todos los documentos del tutor
  this.tutorDocuments.forEach((document, index) => {
    this.acceptDocument(index, true);
  });
}

// Método para rechazar todos los documentos
rejectAll(): void {
  // Rechazar todos los documentos del alumno
  this.studentDocuments.forEach((document, index) => {
    this.rejectDocument(index);
  });

  // Rechazar todos los documentos del tutor
  this.tutorDocuments.forEach((document, index) => {
    this.rejectDocument(index, true);
  });
}


}


