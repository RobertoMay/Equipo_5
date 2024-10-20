import { Component, OnInit } from '@angular/core';
import { StudentDocument } from 'models/istudentdoc.metadata';
import { StudentEnrollmentFormService } from 'services/api/student-enrollment-form/student-enrollment-form.service';
import { StudentdocService } from 'services/api/studentdoc/studentdoc.service';

@Component({
  selector: 'app-step-3',
  templateUrl: './step-3.component.html',
  styleUrls: ['./step-3.component.css'],
})
export class Step3Component implements OnInit {
  studentDocument!: StudentDocument;
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
  aspiranteId: string | null = null;

  constructor(
    private studentdocService: StudentdocService,
    private studentEnrollmentService: StudentEnrollmentFormService
  ) {}

  ngOnInit(): void {
    this.aspiranteId = localStorage.getItem('aspiranteId')!;

    this.getEnrollmentForm();
  }

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

  getEnrollmentForm() {
    this.studentEnrollmentService
      .getById(`aspirante/${this.aspiranteId}`)
      .subscribe(
        (response) => {
          if (!response.error) {
            console.log('En el paso 3: ');
            console.log(response.data);
          } else {
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
