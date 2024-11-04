import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentdocService } from 'services/api/studentdoc/studentdoc.service';
import { IStudentDocDocument } from 'models/istudentdoc.metadata';
import { GestDocStudentsComponent } from '@shared/components/gest-doc-students/gest-doc-students.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoadingService } from 'services/global/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enrolled-students',
  templateUrl: './enrolled-students.component.html',
  styleUrls: ['./enrolled-students.component.css'],
})
export class EnrolledStudentsComponent implements OnInit {
  @ViewChild(GestDocStudentsComponent) gestDocModal!: GestDocStudentsComponent;
  isLoading: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private studentdocService: StudentdocService,
    private _ngxUiLoaderService: NgxUiLoaderService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.isAdmin =
      localStorage.getItem('esAdministrador') === 'true' ? true : false;

    if (token) {
      if (this.isAdmin) {
        this.loadStudents();

        this.loadingService.loading$.subscribe((isLoading) => {
          if (isLoading) {
            this._ngxUiLoaderService.start();
          } else {
            this._ngxUiLoaderService.stop();
          }
        });
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('esAdministrador');
    this.isAdmin = false;
    this.router.navigate(['/']);
  }

  openModal() {
    this.gestDocModal.openModal();
  }

  viewDocuments(aspiranteId: string) {
    console.log('Ver documentos de aspirante con ID:', aspiranteId);
    // Lógica adicional para manejar la visualización de documentos
  }

  selectedAspiranteId!: string;

  onAspiranteIdReceived(aspiranteId: string) {
    // Aquí se define correctamente el parámetro
    this.selectedAspiranteId = aspiranteId;
    console.log(
      'ID recibido en EnrolledStudentsComponent:',
      this.selectedAspiranteId
    ); // Verificar aquí
    this.gestDocModal.aspiranteId = this.selectedAspiranteId; // Asigna el ID al modal
    this.gestDocModal.openModal(); // Abre el modal aquí
  }
  students: IStudentDocDocument[] = [];
  filteredStudents: IStudentDocDocument[] = []; // Array para almacenar los resultados filtrados
  currentPage = 1;
  totalPages = 0; // Inicializa el total de páginas
  searchNameInput = '';
  noMoreStudents = false; // Bandera para mostrar el mensaje de "no hay más estudiantes"

  loadStudents() {
    this.isLoading = true;
    this.loadingService.startLoading();
    this.studentdocService
      .getEnrolledStudents(this.currentPage, this.searchNameInput)
      .subscribe(
        (response) => {
          if (!response.error) {
            this.loadingService.stopLoading();
            this.isLoading = false;
            this.students = response.data;
            console.log('Respuesta de estudiantes:', response.data);

            this.filteredStudents = this.students; // Inicialmente muestra todos los estudiantes
            this.totalPages = response.data.totalPages; // Ajustar para obtener el total de páginas
            this.noMoreStudents = this.students.length === 0; // Actualiza la bandera
          } else {
            this.loadingService.stopLoading();
            this.isLoading = false;
            console.error(response.msg);
          }
        },
        (error) => {
          this.loadingService.stopLoading();
          this.isLoading = false;
          console.error('Error fetching students:', error);
          this.noMoreStudents = true; // Mostrar el mensaje si hay un error
        }
      );
  }

  onSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchNameInput = inputElement.value.toLowerCase();
    this.filterStudents(); // Llama al método de filtrado cuando se escribe en el input
  }

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
}
