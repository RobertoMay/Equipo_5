import {
  Component,
  ChangeDetectorRef,
  Input,
  SimpleChanges,
} from '@angular/core';
import { IGestStudentDocument } from 'models/igest-student-doc.metadata';
import { IGestComment } from 'models/igest-comments.data';
import { GestDocumentsService } from 'services/api/gest-documents.service';
import Swal from 'sweetalert2';
import { StudentDocument } from 'models/istudentdoc.metadata';
import { StudentdocService } from 'services/api/studentdoc/studentdoc.service';
import { Subscription } from 'rxjs';
import { LoadingService } from 'services/global/loading.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-gest-doc-students',
  templateUrl: './gest-doc-students.component.html',
  styleUrls: ['./gest-doc-students.component.css'],
})
export class GestDocStudentsComponent {
  @Input() aspiranteId!: string;

  studentDocuments: StudentDocument[] = [];
  tutorDocuments: StudentDocument[] = [];

  studentDocumentsDefault: StudentDocument[] = [
    {
      name: '',
      type: 'Solicitud Ingreso',
      link: '',
      date: new Date(),
      status: 'pending',
    },
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
  comments: IGestComment[] = [];
  newComment: string = '';
  studentName: string = 'Nombre del Estudiante'; // Puedes actualizarlo según los datos obtenidos
  studentStatus: boolean = false;
  statusTranslation: { [key: string]: string } = {
    pending: 'Pendiente',
    uploaded: 'Subido',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  };
  isAccepted: boolean = false;
  subscription!: Subscription;

  private documentosAlumnoNames: string[] = [
    'Acta de nacimiento',
    'Ultima boleta de calificaciones',
    'Cartilla de vacunación',
    'CURP (Actualizada)',
    'Comprobante de domicilio',
    'Constancia de identidad o escrito libre emitido por la autoridad',
    'Certificado médico',
  ];

  private documentosTutorNames: string[] = [
    'CURP (Actualizada)',
    'Comprobante de domicilio',
    'Credencial de elector',
    'Constancia del último grado de estudio',
  ];

  constructor(
    private gestDocumentsService: GestDocumentsService,
    private cdRef: ChangeDetectorRef,
    private studentdocService: StudentdocService,
    private _ngxUiLoaderService: NgxUiLoaderService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe((isLoading) => {
      if (isLoading) {
        this._ngxUiLoaderService.start();
      } else {
        this._ngxUiLoaderService.stop();
      }
    });

    this.studentDocuments = this.studentDocumentsDefault;
    this.tutorDocuments = this.tutorDocumentsDefault;

    this.subscription = this.studentdocService.refresh$.subscribe(() => {
      this.getDocuments();
    });

    this.gestDocumentsService.refresh$.subscribe(() => {
      this.getDocuments();
    });
  }

  loadComments(): void {
    this.gestDocumentsService
      .getCommentsByAspiranteId(this.aspiranteId)
      .subscribe(
        (comments) => {
          this.comments = comments;
          console.log('Imprimiendo comentarios', this.comments);
        },
        (error) =>
          Swal.fire('Error', 'Error al cargar los comentarios', 'error')
      );
  }

  approveDocument(document: StudentDocument): void {
    this.loadingService.startLoading();
    document.status = 'approved';
    this.gestDocumentsService
      .updateDocumentStatus(this.aspiranteId, document.link, document.status)
      .subscribe(
        () => {
          this.loadingService.stopLoading();
          setTimeout(() => {
            Swal.fire({
              title: 'Documento aprovado',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          }, 750);
        },
        (error) => {
          Swal.fire('Error', 'No se pudo aprobar el documento', error);
          this.loadingService.stopLoading();
        }
      );
  }

  rejectDocument(document: StudentDocument): void {
    this.loadingService.startLoading();
    document.status = 'rejected';
    this.gestDocumentsService
      .updateDocumentStatus(this.aspiranteId, document.link, document.status)
      .subscribe(
        () => {
          this.loadingService.stopLoading();
          setTimeout(() => {
            Swal.fire({
              title: 'Documento rechazado',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          }, 750);
        },
        (error) => {
          Swal.fire('Error', 'No se pudo rechazar el documento', error);
          this.loadingService.stopLoading();
        }
      );
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

          // Actualiza las variables con los datos obtenidos
          this.studentName = student.name; // Actualiza el nombre del estudiante
          this.studentStatus = student.enrollmentStatus; // Actualiza el estado de inscripción

          console.log('Trayendo documentos del alumno ', student);

          // Manejo de documentos
          if (student.Documents && student.Documents.length > 0) {
            // Llenamos la lista de documentos del estudiante
            const backendStudentDocs = student.Documents.filter(
              (doc: StudentDocument) => !doc.type.includes('_tutor')
            );
            this.studentDocuments = this.combineDocuments(
              this.studentDocumentsDefault,
              backendStudentDocs
            );

            // Llenamos la lista de los documentos del tutor
            const backendTutorDocs = student.Documents.filter(
              (doc: StudentDocument) => doc.type.includes('_tutor')
            );
            this.tutorDocuments = this.combineDocuments(
              this.tutorDocumentsDefault,
              backendTutorDocs
            );
          } else {
            console.error('No hay documentos para el estudiante.');
            this.studentDocuments = [...this.studentDocumentsDefault];
            this.tutorDocuments = [...this.tutorDocumentsDefault];
          }
        } else {
          this.loadingService.stopLoading();
          console.log(response.error + ' ' + response.msg);
          // setTimeout(() => {
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Error',
          //     text: response.msg,
          //   });
          // }, 750);
        }
      },
      (error) => {
        this.loadingService.stopLoading();
        console.error(error);
      }
    );
  }

  addComment(): void {
    if (this.newComment.trim()) {
      const comment: IGestComment = {
        id: '', // Se genera automáticamente en el backend
        comment: this.newComment,
        createdAt: new Date(),
        createdBy: 'Admin', // Puedes ajustar esto con los datos del usuario actual
      };
      this.gestDocumentsService
        .addCommentToAspirante(
          this.aspiranteId,
          comment.comment,
          comment.createdBy
        )
        .subscribe(
          (addedComment) => {
            this.comments.push({ ...comment, id: addedComment.message }); // Simula el ID que viene en `addedComment`
            this.newComment = '';
            Swal.fire('Comentario agregado');
          },
          (error) =>
            Swal.fire('Error', 'No se pudo agregar el comentario', 'error')
        );
    }
  }

  deleteComment(commentId: string): void {
    console.log('Esto estamos enviando', commentId, this.aspiranteId);
    this.gestDocumentsService
      .deleteComment(commentId, this.aspiranteId)
      .subscribe(
        () => {
          this.comments = this.comments.filter(
            (comment) => comment.id !== commentId
          );
        },
        (error) => {
          console.log('Esto estamos enviando', commentId, this.aspiranteId);
          console.log(error + ' ' + error.error);
          setTimeout(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error al borrar comentario',
              text: error,
            });
          }, 750);
        }
      );
  }

  updateAllStatus(status: 'approved' | 'rejected'): void {
    this.gestDocumentsService
      .updateAllDocumentsStatus(this.aspiranteId, status)
      .subscribe(
        (response) => {
          setTimeout(() => {
            Swal.fire({
              title: 'Todos los documentos han sido actualizados',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          }, 750);
        },
        (error) => {
          setTimeout(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error,
            });
          }, 750);
        }
      );
  }

  get aspiranteIdValue(): string {
    return this.aspiranteId || 'ID no disponible';
  }

  isModalOpen = false;
  // Método que se llamará al recibir el evento del botón
  openModal() {
    this.isModalOpen = true;

    this.loadComments();

    this.getDocuments();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['aspiranteId'] && changes['aspiranteId'].currentValue) {
      console.log('Cambio en aspiranteId:', this.aspiranteId);

      this.cdRef.detectChanges(); // Forzar la detección de cambios
    }
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      case 'pending':
        return 'badge-pending';
      case 'uploaded':
        return 'badge-uploaded';
      default:
        return 'badge-default';
    }
  }
  closeModal() {
    this.isModalOpen = false;
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  openDocument(document: StudentDocument): void {
    if (document.link) {
      window.open(document.link, '_blank');
    } else {
      console.error('El documento no tiene una URL válida.');
    }
  }
}
