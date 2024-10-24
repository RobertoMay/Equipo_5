import { Component, OnInit } from '@angular/core';
import { IStudentDocDocument } from 'models/istudentdoc.metadata'; 
import { StudentService } from 'services/api/student/student.service';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.css']
})
export class ApplicantsComponent implements OnInit{
  students: IStudentDocDocument[] = [];
  filteredStudents: IStudentDocDocument[] = [];
  currentPage = 1;
  totalPages = 1;
  searchName = '';
  searchNameInput = '';
  noMoreStudents = false; // Bandera para mostrar el mensaje de "no hay más estudiantes"
  alumno: any;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadStudents();
  }
  
  loadStudents() {
    this.studentService.getNotEnrolledStudents(this.currentPage, this.searchName).subscribe(response => {
      if (!response.error) {
        console.log(response);
        this.students = response.data; // Asegúrate de que esta asignación es correcta
        this.filteredStudents = this.students;
        this.totalPages = response.data.totalPages;
      } else {
        console.error(response.msg);
      }
    }, error => {
      console.error('Error fetching students:', error);
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
