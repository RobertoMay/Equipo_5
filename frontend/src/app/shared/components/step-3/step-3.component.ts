import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { StudentDocument } from 'models/istudentdoc.metadata';
import { StudentEnrollmentFormService } from 'services/api/student-enrollment-form/student-enrollment-form.service';
import { StudentdocService } from 'services/api/studentdoc/studentdoc.service';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoadingService } from 'services/global/loading.service';
import { Subscription } from 'rxjs';
import { IComments } from 'models/icomments.data';

@Component({
  selector: 'app-step-3',
  templateUrl: './step-3.component.html',
  styleUrls: ['./step-3.component.css'],
})
export class Step3Component implements OnInit, OnDestroy {
  studentDocuments: StudentDocument[] = [];
  tutorDocuments: StudentDocument[] = [];
  studentDocumentsDefault: StudentDocument[] = [
    {
      name: '',
      type: 'Acta de nacimiento',
      link: '',
      date: new Date(),
      status: 'pending',
    },
    {
      name: '',
      type: 'Ultima boleta de calificaciones',
      link: '',
      date: new Date(),
      status: 'pending',
    },
    {
      name: '',
      type: 'Cartilla de vacunación',
      link: '',
      date: new Date(),
      status: 'pending',
    },
    {
      name: '',
      type: 'CURP',
      link: '',
      date: new Date(),
      status: 'pending',
    },
    {
      name: '',
      type: 'Comprobante de domicilio',
      link: '',
      date: new Date(),
      status: 'pending',
    },
    {
      name: '',
      type: 'Constancia de identidad',
      link: '',
      date: new Date(),
      status: 'pending',
    },
    {
      name: '',
      type: 'Certificado médico',
      link: '',
      date: new Date(),
      status: 'pending',
    },
  ];
  tutorDocumentsDefault: StudentDocument[] = [
    {
      name: '',
      type: 'CURP_tutor',
      link: '',
      date: new Date(),
      status: 'pending',
    },
    {
      name: '',
      type: 'Comprobante de domicilio_tutor',
      link: '',
      date: new Date(),
      status: 'pending',
    },
    {
      name: '',
      type: 'Credencial del lector_tutor',
      link: '',
      date: new Date(),
      status: 'pending',
    },
    {
      name: '',
      type: 'Constancia del último grado de estudio_tutor',
      link: '',
      date: new Date(),
      status: 'pending',
    },
  ];
  statusTranslation: { [key: string]: string } = {
    pending: 'Pendiente',
    uploaded: 'Subido',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  };
  user: any;
  @Output() enrollmentStatusChange = new EventEmitter<boolean>();
  @Output() enrollmentPeriodChange = new EventEmitter<string>();
  isAccepted: boolean = false;
  comments: IComments[] = [];
  aspiranteId: string | null = null;
  studentName: string = 'Nombre Alumno';
  enrollmentPeriod: string = '';
  firstDocumentName: string = 'Documento generado';
  subscription!: Subscription;

  constructor(
    private studentdocService: StudentdocService,
    private studentEnrollmentService: StudentEnrollmentFormService,
    private _ngxUiLoaderService: NgxUiLoaderService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.aspiranteId = localStorage.getItem('aspiranteId')!;
    this.getDocuments();

    this.studentDocuments = this.studentDocumentsDefault;
    this.tutorDocuments = this.tutorDocumentsDefault;

    this.subscription = this.studentdocService.refresh$.subscribe(() => {
      this.getDocuments();
    });

    this.getComments();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-pending';
      case 'uploaded':
        return 'badge-uploaded';
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      default:
        return 'badge-default';
    }
  }

  combineDocuments(
    defaultDocuments: StudentDocument[],
    backendDocuments: StudentDocument[]
  ): StudentDocument[] {
    return defaultDocuments.map((defaultDoc) => {
      const foundDoc = backendDocuments.find(
        (doc) => doc.type === defaultDoc.type
      );
      if (foundDoc) {
        return {
          ...defaultDoc,
          name: foundDoc.name,
          link: foundDoc.link,
          date: foundDoc.date,
          status: foundDoc.status,
        };
      }
      return defaultDoc;
    });
  }

  getComments() {
    this.loadingService.startLoading();
    this.studentdocService.getById('comments/' + this.aspiranteId).subscribe(
      (response) => {
        if (
          !response.error &&
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          this.loadingService.stopLoading();

          this.comments = response.data;
        } else {
          this.loadingService.stopLoading();
          console.log(response.error + ' ' + response.msg);
        }
      },
      (error) => {
        this.loadingService.stopLoading();
        console.error(error);
      }
    );
  }

  getDocuments() {
    this.loadingService.startLoading();
    this.studentdocService.getById('student/' + this.aspiranteId).subscribe(
      (response) => {
        if (
          !response.error &&
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          this.loadingService.stopLoading();

          const student = response.data[0];

          if (student!.name && student!.enrollmentPeriod) {
            this.studentName = `${student!.name}`;
            this.enrollmentPeriod = student!.enrollmentPeriod;
            this.enrollmentPeriodChange.emit(this.enrollmentPeriod);
            this.isAccepted = student!.enrollmentStatus;
            this.enrollmentStatusChange.emit(this.isAccepted);

            if (student.Documents && student.Documents.length > 0) {
              this.firstDocumentName = student.Documents[0].name;
            } else {
              console.error('No hay documentos para el estudiante.');
              this.firstDocumentName = 'Documento no disponible';
            }

            // Llenamos la lista de documentos del estudiante
            if (student.Documents && student.Documents.length > 1) {
              const backendStudentDocs = student.Documents.filter(
                (doc: StudentDocument) => !doc.type.includes('_tutor')
              );
              this.studentDocuments = this.combineDocuments(
                this.studentDocumentsDefault,
                backendStudentDocs
              );
            } else {
              this.studentDocuments = [...this.studentDocumentsDefault];
            }

            // Llenamos la lista de los documentos del tutor
            if (student.Documents && student.Documents.length > 1) {
              const backendTutorDocs = student.Documents.filter(
                (doc: StudentDocument) => doc.type.includes('_tutor')
              );
              this.tutorDocuments = this.combineDocuments(
                this.tutorDocumentsDefault,
                backendTutorDocs
              );
            } else {
              this.studentDocuments = [...this.studentDocumentsDefault];
            }
          } else {
            console.error('Información del estudiante incompleta.');
          }
        } else {
          this.loadingService.stopLoading();
          console.log(response.error + ' ' + response.msg);
          setTimeout(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.msg,
            });
          }, 750);
        }
      },
      (error) => {
        this.loadingService.stopLoading();
        console.error(error);
      }
    );
  }
}
