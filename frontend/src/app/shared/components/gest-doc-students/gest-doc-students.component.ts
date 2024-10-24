import { Component } from '@angular/core';

@Component({
  selector: 'app-gest-doc-students',
  templateUrl: './gest-doc-students.component.html',
  styleUrls: ['./gest-doc-students.component.css']
})
export class GestDocStudentsComponent {

  isModalOpen = true;
  studentName = 'Angela Chin';

  isAccepted: boolean = false;

  studentDocuments = [
    { status: 'approved', iconStatus: '' },
    { status: 'pending', iconStatus: '' },
    { status: 'rejected', iconStatus: '' },
    { status: 'pending', iconStatus: '' },
  { status: 'approved', iconStatus: '' },
  { status: 'rejected', iconStatus: '' },
  { status: 'rejected', iconStatus: '' },
  { status: 'pending', iconStatus: '' } // Documento generado
  ];

  tutorDocuments = [
    { status: 'rejected', iconStatus: '' },
    { status: 'approved', iconStatus: '' },
    { status: 'rejected', iconStatus: '' },
    { status: 'approved', iconStatus: '' },
  ];

  documentNames = [
  'Acta de Nacimiento',
  'Ultima Boleta de Estudios',
  'Cartilla de vacunacion',
  'CURP (Actualizada)',
  'Comprobante de domicilio',
  'Constancia de identidad o escrito libre emitido por la autoridad',
  'Certificado medico',
  
  'Documento generado'];
  tutorDocumentNames = [ 'Identificación del Tutor',
    'Comprobante de Domicilio',
    'Carta de No Antecedentes Penales',
    'Comprobante de Ingresos'];

  statusTranslation: { [key: string]: string } = {
    approved: 'Aprobado',
    rejected: 'Rechazado',
    pending: 'Pendiente'
  };

  comments = ['Falta corregir el acta de nacimiento.', 'Todo está en orden.'];

  getBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      case 'pending':
        return 'badge-default';
      default:
        return 'badge-default';
    }
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  newComment: string = '';

  acceptDocument(index: number, isTutor: boolean = false) {
    if (isTutor) {
      this.tutorDocuments[index].status = 'approved';
      this.tutorDocuments[index].iconStatus = 'approved';
    } else {
      this.studentDocuments[index].status = 'approved';
      this.studentDocuments[index].iconStatus = 'approved';
    }
  }

  rejectDocument(index: number, isTutor: boolean = false) {
    if (isTutor) {
      this.tutorDocuments[index].status = 'rejected';
      this.tutorDocuments[index].iconStatus = 'rejected';
    } else {
      this.studentDocuments[index].status = 'rejected';
      this.studentDocuments[index].iconStatus = 'rejected';
    }
  }

  addComment() {
    if (this.newComment) {
      this.comments.push(this.newComment);
      this.newComment = '';
    }
  }

  deleteComment(index: number): void {
    this.comments.splice(index, 1);
  }

  acceptAll(): void {
    this.studentDocuments.forEach((document, index) => this.acceptDocument(index));
    this.tutorDocuments.forEach((document, index) => this.acceptDocument(index, true));
  }

  rejectAll(): void {
    this.studentDocuments.forEach((document, index) => this.rejectDocument(index));
    this.tutorDocuments.forEach((document, index) => this.rejectDocument(index, true));
  }
}
