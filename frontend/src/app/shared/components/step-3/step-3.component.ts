import { Component } from '@angular/core';

@Component({
  selector: 'app-step-3',
  templateUrl: './step-3.component.html',
  styleUrls: ['./step-3.component.css'],
})
export class Step3Component {
  studentDocuments = [
    { name: 'Acta de nacimiento', status: 'Pending' },
    { name: 'Ultima boleta de calificaciones', status: 'Uploaded' },
    { name: 'CURP (Actualizada)', status: 'Pending' },
    { name: 'Cartilla de vacunación', status: 'Approved' },
    { name: 'Comprobante de domicilio', status: 'Uploaded' },
    {
      name: 'Constancia de identidad o escrito libre emitido por la autoridad',
      status: 'Uploaded',
    },
    { name: 'Certificado médico', status: 'Pending' },
  ];

  tutorDocuments = [
    { name: 'CURP (Actualizada)', status: 'Pending' },
    { name: 'Comprobante de domicilio', status: 'Uploaded' },
    { name: 'Credencial del lector', status: 'Approved' },
    { name: 'Constancia del último grado de estudio', status: 'Uploaded' },
  ];
  user: any;
  isAccepted: boolean = false;
  comments: any[] = [];

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'Uploaded':
        return 'badge-uploaded';
      case 'Approved':
        return 'badge-approved';
      default:
        return 'badge-default';
    }
  }
}
