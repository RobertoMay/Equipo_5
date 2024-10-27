import { Component,ChangeDetectorRef, Input ,SimpleChanges } from '@angular/core';
import { IGestStudentDocument } from 'models/igest-student-doc.metadata';
import { IGestComment } from 'models/igest-comments.data';
import { GestDocumentsService } from 'services/api/gest-documents.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gest-doc-students',
  templateUrl: './gest-doc-students.component.html',
  styleUrls: ['./gest-doc-students.component.css']
})
export class GestDocStudentsComponent {
  @Input() aspiranteId!: string;


  studentDocuments: IGestStudentDocument[] = [];
  tutorDocuments: IGestStudentDocument[] = [];
  comments: IGestComment[] = [];
  newComment: string = '';
  studentName: string = 'Nombre del Estudiante'; // Puedes actualizarlo según los datos obtenidos
  studentStatus: string = 'Pendiente';

  private documentosAlumnoNames: string[] = [
    'Acta de nacimiento',
    'Ultima boleta de calificaciones',
    'Cartilla de vacunación',
    'CURP (Actualizada)',
    'Comprobante de domicilio',
    'Constancia de identidad o escrito libre emitido por la autoridad',
    'Certificado médico'
  ];

  private documentosTutorNames: string[] = [
    'CURP (Actualizada)',
    'Comprobante de domicilio',
    'Credencial de elector',
    'Constancia del último grado de estudio'
  ];


  constructor(private gestDocumentsService: GestDocumentsService,
    private cdRef: ChangeDetectorRef
  ) {}

  


  ngOnInit() {
    console.log("Aspirante ID recibido en el modal:", this.aspiranteId);
    // Lógica adicional usando aspiranteId
    
  }



  loadDocuments(): void {
    console.log('aspiranteId desde loadDocuments', this.aspiranteId);
    
    this.gestDocumentsService.getDocumentsByAspiranteId(this.aspiranteId).subscribe(
      (documents) => {
        this.studentDocuments = documents.filter(doc => doc.role === 'student');
        this.tutorDocuments = documents.filter(doc => doc.role === 'tutor');
      },
      (error) => {
        Swal.fire('Error', 'Error al cargar los documentos', 'error');
      }
    );
  }


  loadComments(): void {
    console.log('aspiranteId desde loadComment', this.aspiranteId);
    this.gestDocumentsService.getCommentsByAspiranteId(this.aspiranteId).subscribe(
      (comments) => this.comments = comments,
      (error) => Swal.fire('Error', 'Error al cargar los comentarios', 'error')
    );
  }

  
  approveDocument(document: IGestStudentDocument): void {
    document.status = 'approved';
    this.gestDocumentsService.updateDocumentStatus(this.aspiranteId, document.link, document.status).subscribe(
      () => Swal.fire('Documento aprobado'),
      (error) => Swal.fire('Error', 'No se pudo aprobar el documento', 'error')
    );
  }




  rejectDocument(document: IGestStudentDocument): void {
    document.status = 'rejected';
    this.gestDocumentsService.updateDocumentStatus(this.aspiranteId, document.link, document.status).subscribe(
      () => Swal.fire('Documento rechazado'),
      (error) => Swal.fire('Error', 'No se pudo rechazar el documento', 'error')
    );
  }

  /*approveAll(role: 'student' | 'tutor'): void {
    const docs = role === 'student' ? this.studentDocuments : this.tutorDocuments;
    docs.forEach(doc => doc.status = 'approved');
    this.gestDocumentsService.updateAllDocumentStatus(this.aspiranteId, docs).subscribe(
      () => Swal.fire('Todos los documentos han sido aprobados'),
      (error) => Swal.fire('Error', 'No se pudieron aprobar todos los documentos', 'error')
    );
  }*/

  /*rejectAll(role: 'student' | 'tutor'): void {
    const docs = role === 'student' ? this.studentDocuments : this.tutorDocuments;
    docs.forEach(doc => doc.status = 'rejected');
    this.gestDocumentsService.updateAllDocumentStatus(this.aspiranteId, docs).subscribe(
      () => Swal.fire('Todos los documentos han sido rechazados'),
      (error) => Swal.fire('Error', 'No se pudieron rechazar todos los documentos', 'error')
    );
  }*/

  addComment(): void {
    if (this.newComment.trim()) {
      const comment: IGestComment = {
        id: '',  // Se genera automáticamente en el backend
        text: this.newComment,
        createdAt: new Date(),
        createdBy: 'Admin' // Puedes ajustar esto con los datos del usuario actual
      };
      this.gestDocumentsService.addCommentToAspirante(this.aspiranteId, comment.text, comment.createdBy).subscribe(
        (addedComment) => {
          this.comments.push({ ...comment, id: addedComment.message }); // Simula el ID que viene en `addedComment`
          this.newComment = '';
          Swal.fire('Comentario agregado');
        },
        (error) => Swal.fire('Error', 'No se pudo agregar el comentario', 'error')
      );
    }
  }

  deleteComment(commentId: string): void {
    this.gestDocumentsService.deleteComment(this.aspiranteId, commentId).subscribe(
      () => {
        this.comments = this.comments.filter(comment => comment.id !== commentId);
        Swal.fire('Comentario eliminado');
      },
      (error) => Swal.fire('Error', 'No se pudo eliminar el comentario', 'error')
    );
  }






  get aspiranteIdValue(): string {
    return this.aspiranteId || 'ID no disponible';
  }
  
  isModalOpen = false;
  // Método que se llamará al recibir el evento del botón
  openModal() {
    console.log("Abriendo modal para aspirante ID:", this.aspiranteId);
    // Verificamos que `aspiranteId` esté definido antes de proceder
 

    

    this.isModalOpen = true;
  
    // Verificamos que `aspiranteId` esté definido antes de proceder
 /* if (!this.aspiranteId) {
    console.error("Error: aspiranteId no está definido");
    return;
  }
    this.loadDocuments();
    this.loadComments();  */
    
    this.loadDocuments();
    this.loadComments();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['aspiranteId'] && changes['aspiranteId'].currentValue) {
      console.log("Cambio en aspiranteId:", this.aspiranteId);
      // Aquí puedes agregar lógica adicional para manejar el ID
       // Llama a los métodos para cargar documentos y comentarios
  
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
        return 'badge-default';
      default:
        return 'badge-default';
    }
  }
  closeModal() {
    this.isModalOpen = false;
  }
  /*studentName = 'Angela Chin';*/

  //isAccepted: boolean = false;

  /*studentDocuments = [
    { status: 'approved', iconStatus: '' },
    { status: 'pending', iconStatus: '' },
    { status: 'rejected', iconStatus: '' },
    { status: 'pending', iconStatus: '' },
  { status: 'approved', iconStatus: '' },
  { status: 'rejected', iconStatus: '' },
  { status: 'rejected', iconStatus: '' },
  { status: 'pending', iconStatus: '' } // Documento generado
  ];*/

 /* tutorDocuments = [
    { status: 'rejected', iconStatus: '' },
    { status: 'approved', iconStatus: '' },
    { status: 'rejected', iconStatus: '' },
    { status: 'approved', iconStatus: '' },
  ];*/

 /* documentNames = [
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
  };*/

  /*comments = ['Falta corregir el acta de nacimiento.', 'Todo está en orden.'];*/

 /* getBadgeClass(status: string): string {
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
  }*/

  

  

 /* acceptDocument(index: number, isTutor: boolean = false) {
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
  }*/

  /*addComment() {
    if (this.newComment) {
      this.comments.push(this.newComment);
      this.newComment = '';
    }
  }*/
/*
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
  }*/


    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
    }

}
