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
  currentPage = 1;
  totalPages = 1;
  searchName = '';
  searchNameInput = '';
  alumno: any;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadStudents();
    console.log('Students data NO enrrollement:', this.students);
  }

  loadStudents() {
    this.studentService.getNotEnrolledStudents(this.currentPage, this.searchName).subscribe(response => {
      console.log('Response from service:', response); // Verifica la respuesta completa
      if (!response.error) {
        this.students = response.data; // Asegúrate de que esta asignación es correcta
        console.log('Students loaded:', this.students); // Verifica que los estudiantes estén cargados

      } else {
        console.error(response.msg);
      }
    }, error => {
      console.error('Error fetching students:', error);
    });
  }
}
