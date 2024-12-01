import { Component, OnInit, ViewChild } from '@angular/core';
import { IStudentDocDocument } from 'models/istudentdoc.metadata';
import { StudentService } from 'services/api/student/student.service';
import { GestDocStudentsComponent } from '@shared/components/gest-doc-students/gest-doc-students.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
import { LoadingService } from 'services/global/loading.service';
import { Router } from '@angular/router';
import {
  IConvocatoria,
  IConvocatoriaResponse,
} from '../../../../models/icalls.metadata';
import { CallService } from '../../../../services/api/call/call.service';
import { ExpiredService } from 'services/api/expired/expired.service';
import { IExpired } from 'models/iexpired.data';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.css'],
})
export class ApplicantsComponent implements OnInit {
  students: IStudentDocDocument[] = [];
  call: IConvocatoria | null = null;
  filteredStudents: IStudentDocDocument[] = []; // Para filtrar todo lo que tenga la Barra de busqueda
  currentPage = 1; //para la paginacion
  totalPages = 1;
  searchName = ''; //Para que la barra de busqueda no tenga nada
  searchNameInput = ''; // Este es el valor para la barra de búsqueda
  noMoreStudents = false; // Bandera para mostrar el mensaje de "no hay más estudiantes"
  alumno: any;
  @ViewChild(GestDocStudentsComponent) gestDocModal!: GestDocStudentsComponent;
  selectedAspiranteId!: string;
  isLoading: boolean = false;
  isAdmin: boolean = false;
  expired!: IExpired[];
  isExpired: boolean = false;

  constructor(
    private callService: CallService,
    private studentService: StudentService,
    private _ngxUiLoaderService: NgxUiLoaderService,
    private loadingService: LoadingService,
    private router: Router,
    private expiredService: ExpiredService
  ) {}

  ngOnInit() {
    this.loadcall();
    const token = localStorage.getItem('token');
    this.isAdmin =
      localStorage.getItem('esAdministrador') === 'true' ? true : false;

    if (token) {
      if (this.isAdmin) {
        this.loadStudents();
        this.callExpired();
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }

    this.loadingService.loading$.subscribe((isLoading) => {
      if (isLoading) {
        this._ngxUiLoaderService.start();
      } else {
        this._ngxUiLoaderService.stop();
      }
    });
  }

  loadcall() {
    this.callService.getCurrentAnnouncement().subscribe({
      next: (convocatoria) => {
        if (convocatoria) {
          this.call = (
            convocatoria as unknown as IConvocatoriaResponse
          ).convocatoria;
        } else {
          console.warn('No se encontró ninguna convocatoria actual');
          this.call = null;
        }
      },
      error: (error) => {
        console.error('Error al obtener la convocatoria actual:', error);
        this.call = null;
      },
    });
  }

  calculateOccupiedPercentage(
    occupiedCupo?: number,
    availableCupo?: number
  ): number {
    if (!occupiedCupo || !availableCupo) return 0;
    const totalCupo = occupiedCupo + availableCupo;
    return (occupiedCupo / totalCupo) * 100;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('esAdministrador');
    this.isAdmin = false;
    this.router.navigate(['/']);
  }

  loadStudents() {
    this.isLoading = true;
    this.loadingService.startLoading();
    this.studentService
      .getNotEnrolledStudents(this.currentPage, this.searchNameInput)
      .subscribe(
        (response) => {
          if (!response.error) {
            this.students = response.data || [];
            this.filteredStudents = this.students; // Inicializa los estudiantes filtrados
            this.noMoreStudents = this.students.length === 0;
          } else {
            Swal.fire(
              'Aviso',
              'Actualmente no hay más estudiantes no inscritos disponibles.',
              'warning'
            );
            this.currentPage = this.currentPage - 1;
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

  callExpired() {
    this.expiredService.getById('days-until-delete/').subscribe(
      (response) => {
        if (
          !response.error &&
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          this.isExpired = true;
          this.expired = response.data;
        } else {
          console.log(response.error + ' ' + response.msg);
          this.expired = [];
          this.isExpired = false;
        }
      },
      (error) => {
        console.error(error);
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

  changePage(page: number) {
    if (page >= 1 && (!this.noMoreStudents || page <= this.totalPages)) {
      this.currentPage = page;
      this.loadStudents(); // Llama a la función para cargar estudiantes de la nueva página
    }
  }
  formatDateMexican(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
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
  }

  onAspiranteIdReceived(aspiranteId: string) {
    this.selectedAspiranteId = aspiranteId;
    if (this.gestDocModal) {
      this.gestDocModal.aspiranteId = this.selectedAspiranteId;
      this.gestDocModal.openModal();
    } else {
      console.warn('gestDocModal no está definido.');
    }
  }
}
