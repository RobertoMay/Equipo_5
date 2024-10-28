import { Component, OnInit, ViewChild } from '@angular/core';
import { IStudentDocDocument } from 'models/istudentdoc.metadata';
import { StudentService } from 'services/api/student/student.service';
import { GestDocStudentsComponent } from '@shared/components/gest-doc-students/gest-doc-students.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoadingService } from 'services/global/loading.service';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.css'],
})
export class ApplicantsComponent implements OnInit {
  students: IStudentDocDocument[] = [];
  filteredStudents: IStudentDocDocument[] = []; // Para filtrar todo lo que tenga la Barra de busqueda
  currentPage = 1; //para la paginacion 
  totalPages = 1;
  searchName = ''; //Para que la barra de busqueda no tenga nada
  searchNameInput = '';
  noMoreStudents = false; // Bandera para mostrar el mensaje de "no hay más estudiantes"
  alumno: any;
  @ViewChild(GestDocStudentsComponent) gestDocModal!: GestDocStudentsComponent;
  selectedAspiranteId!: string;

  constructor(
    private studentService: StudentService,
    private _ngxUiLoaderService: NgxUiLoaderService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadStudents();

    this.loadingService.loading$.subscribe((isLoading) => {
      if (isLoading) {
        this._ngxUiLoaderService.start();
      } else {
        this._ngxUiLoaderService.stop();
      }
    });
  }

  loadStudents() {
    this.loadingService.startLoading();
    this.studentService
      .getNotEnrolledStudents(this.currentPage, this.searchName)
      .subscribe(
        (response) => {
          if (!response.error) {
            this.loadingService.stopLoading();
            this.students = response.data; // Asegúrate de que esta asignación es correcta
            this.filteredStudents = this.students;
            this.totalPages = response.data.totalPages;
          } else {
            console.error(response.msg);
          }
        },
        (error) => {
          this.loadingService.stopLoading();
          console.error('Error fetching students:', error);
        }
      );
  }

  onSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchNameInput = inputElement.value.toLowerCase();
    this.filterStudents(); // Llama al método de filtrado cuando se escribe en el buscador
  }

  //Es el metodo para buscar el nombre de los estudiantes dependiendo de lo que se escriba en el buscador
  filterStudents() {
    this.filteredStudents = this.students.filter((student) => {
      const name = student.name?.toLowerCase() || ''; // Manejar undefined
      const lastName1 = student.lastName1?.toLowerCase() || ''; // Manejar undefined
      const lastName2 = student.lastName2?.toLowerCase() || ''; // Manejar undefined
      return (
        name.includes(this.searchNameInput) ||
        lastName1.includes(this.searchNameInput) ||
        lastName2.includes(this.searchNameInput)
      );
    });

    // Actualiza la bandera de no más estudiantes
    this.noMoreStudents = this.filteredStudents.length === 0;
  }

  //Para la paginacion (Cambiar de pagina)
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadStudents(); // Cargar los estudiantes de la nueva página
    }
  }

  getPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  openModal() {
    this.gestDocModal.openModal();
  }

  viewDocuments(aspiranteId: string) {
    console.log('Ver documentos de aspirante con ID:', aspiranteId);
    // Lógica adicional para manejar la visualización de documentos
  }

  onAspiranteIdReceived(aspiranteId: string) {
    // Aquí se define correctamente el parámetro
    this.selectedAspiranteId = aspiranteId;
    console.log(
      'ID recibido en EnrolledStudentsComponent:',
      this.selectedAspiranteId
    ); // Verificar aquí
    if (this.gestDocModal) {
      this.gestDocModal.aspiranteId = this.selectedAspiranteId;
      this.gestDocModal.openModal();
    } else {
      console.warn('gestDocModal no está definido.');
    }
  }
}
