import { Component } from '@angular/core';
import { StudentdocService } from 'services/api/studentdoc/studentdoc.service';
import { IStudentDocDocument } from 'models/istudentdoc.metadata';

@Component({
  selector: 'app-enrolled-students',
  templateUrl: './enrolled-students.component.html',
  styleUrls: ['./enrolled-students.component.css']
})
export class EnrolledStudentsComponent {
  students: IStudentDocDocument[] = [];
  filteredStudents: IStudentDocDocument[] = []; // Array para almacenar los resultados filtrados
  currentPage = 1;
  totalPages = 0; // Inicializa el total de páginas
  searchNameInput = '';
  noMoreStudents = false; // Bandera para mostrar el mensaje de "no hay más estudiantes"

  constructor(private studentdocService: StudentdocService) {}

  ngOnInit() {
    this.loadStudents(); // Cargar los estudiantes al inicio
  }

  loadStudents() {
    this.studentdocService.getEnrolledStudents(this.currentPage, this.searchNameInput)
      .subscribe(response => {
        if (!response.error) {
          this.students = response.data;
          this.filteredStudents = this.students; // Inicialmente muestra todos los estudiantes
          this.totalPages = response.data.totalPages; // Ajustar para obtener el total de páginas
          this.noMoreStudents = this.students.length === 0; // Actualiza la bandera
        } else {
          console.error(response.msg);
        }
      }, error => {
        console.error('Error fetching students:', error);
        this.noMoreStudents = true; // Mostrar el mensaje si hay un error
      });
  }

  onSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchNameInput = inputElement.value.toLowerCase();
    this.filterStudents(); // Llama al método de filtrado cuando se escribe en el input
  }

  filterStudents() {
    this.filteredStudents = this.students.filter(student => {
      const name = student.name?.toLowerCase() || ''; // Manejar undefined
      const lastName1 = student.lastName1?.toLowerCase() || ''; // Manejar undefined
      const lastName2 = student.lastName2?.toLowerCase() || ''; // Manejar undefined
      return name.includes(this.searchNameInput) || 
             lastName1.includes(this.searchNameInput) || 
             lastName2.includes(this.searchNameInput);
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
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  
}
