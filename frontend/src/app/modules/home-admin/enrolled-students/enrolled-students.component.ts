import { Component } from '@angular/core';
import { StudentdocService } from 'services/api/studentdoc/studentdoc.service'; // Asegúrate de usar la ruta correcta para el servicio
import { IStudentDocDocument } from 'models/istudentdoc.metadata'; 


@Component({
  selector: 'app-enrolled-students',
  templateUrl: './enrolled-students.component.html',
  styleUrls: ['./enrolled-students.component.css']
})
export class EnrolledStudentsComponent {
  students: IStudentDocDocument[] = [];
  currentPage = 1;
  totalPages = 1;
  searchName = '';
  searchNameInput = ''; // Valor temporal del input de búsqueda

  constructor(private studentdocService: StudentdocService) {}

  ngOnInit() {
    this.loadStudents();// Cargar los estudiantes cuando el componente se inicie
    console.log('Students data enrrollement:', this.students); // Verifica el array de estudiantes
  }

  loadStudents() {
    this.studentdocService.getEnrolledStudents(this.currentPage, this.searchName)
      .subscribe(response => {
        console.log('Response from service:', response); 
        if (!response.error) {
          this.students = response.data; 
          console.log('Students loaded:', this.students); 

        } else {
          console.error(response.msg);
        }
      }, error => {
        console.error('Error fetching students:', error);
      });
  }
  
  
  
  onSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchNameInput = inputElement.value;
  }

  searchStudents() {
    this.currentPage = 1;
    this.loadStudents();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadStudents(); // Cargar los estudiantes de la nueva página
    }
  }

  viewDocuments(student: IStudentDocDocument) {
    console.log('Ver documentos de', student.name);
  }
}