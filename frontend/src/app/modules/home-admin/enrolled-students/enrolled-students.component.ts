import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'services/api/student/student.service';
import { IStudentDocDocument } from 'models/istudentdoc.metadata';
import { GestDocStudentsComponent } from '@shared/components/gest-doc-students/gest-doc-students.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoadingService } from 'services/global/loading.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-enrolled-students',
  templateUrl: './enrolled-students.component.html',
  styleUrls: ['./enrolled-students.component.css'],
})
export class EnrolledStudentsComponent implements OnInit {
  @ViewChild(GestDocStudentsComponent) gestDocModal!: GestDocStudentsComponent;
  isLoading: boolean = false;
  isAdmin: boolean = false;
  searchName = '';
  currentPage = 1; //para la paginacion
  students: IStudentDocDocument[] = [];
  filteredStudents: IStudentDocDocument[] = []; // Array para almacenar los resultados filtrados
  totalPages = 0; // Inicializa el total de páginas
  searchNameInput = '';
  noMoreStudents = false; // Bandera para mostrar el mensaje de "no hay más estudiantes"

  constructor(
    private studentService: StudentService,
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
   
    // Lógica adicional para manejar la visualización de documentos
  }

  selectedAspiranteId!: string;

  onAspiranteIdReceived(aspiranteId: string) {
    // Aquí se define correctamente el parámetro
    this.selectedAspiranteId = aspiranteId;
    this.gestDocModal.aspiranteId = this.selectedAspiranteId; // Asigna el ID al modal
    this.gestDocModal.openModal(); // Abre el modal aquí
  }
 
  loadStudents() {
    this.isLoading = true;
    this.loadingService.startLoading();
    this.studentService.getEnrolledStudents(this.currentPage, this.searchNameInput).subscribe(
      (response) => {
        if (!response.error) {
          this.students = response.data || [];
          this.filteredStudents = this.students; // Inicializa los estudiantes filtrados
          this.noMoreStudents = this.students.length === 0;
          console.log(this.students); // Verifica que los estudiantes se están cargando correctamente
        } else {
          Swal.fire(
            'Aviso',
            'Actualmente no hay más estudiantes inscritos disponibles.',
            'warning'
          );
          this.currentPage = this.currentPage -1;
        }
        this.isLoading = false;
        this.loadingService.stopLoading();
      },
      (error) => {
        console.error('Error fetching students:', error);
        this.isLoading = false;
        this.loadingService.stopLoading();
      }
    );
  }

  onSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchNameInput = inputElement.value.toLowerCase(); // Usa searchNameInput para el filtro
    this.currentPage = 1; // Reinicia la página a 1 cuando el filtro cambie
    this.filterStudents(); // Filtra los estudiantes localmente
  }
  
  filterStudents() {
    this.filteredStudents = this.students.filter((student) => {
      const name = student.name?.toLowerCase() || ''; // Manejar undefined
      const lastName1 = student.lastName1?.toLowerCase() || ''; // Manejar undefined
      const lastName2 = student.lastName2?.toLowerCase() || ''; // Manejar undefined
      return (
        name.includes(this.searchNameInput) || // Compara con searchNameInput
        lastName1.includes(this.searchNameInput) ||
        lastName2.includes(this.searchNameInput)
      );
    });
  
    // Actualiza la bandera de no más estudiantes
    this.noMoreStudents = this.filteredStudents.length === 0;
  }


  //Para la paginacion (Cambiar de pagina)
  changePage(page: number) {
    if (page >= 1 && (!this.noMoreStudents || page <= this.totalPages)) {
      this.currentPage = page;
      this.loadStudents(); // Llama a la función para cargar estudiantes de la nueva página
    }
  }
  

  getPagesArray(): number[] {
    console.log(this.totalPages)
    return Array(this.totalPages+1)
      .fill(0)
      .map((_, i) => i + 1);
  }

}
