import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IConvocatoria } from '../../../models/icalls.metadata';
import { CallService } from '../../../services/api/call/call.service';
import { IStudentEnrollmentForm } from 'models/istudent-enrollment-form';
import { StudentEnrollmentFormService } from 'services/api/student-enrollment-form/student-enrollment-form.service';

@Component({
  selector: 'app-student-portal',
  templateUrl: './student-portal.component.html',
  styleUrls: ['./student-portal.component.css'],
})
export class StudentPortalComponent implements OnInit {
  isAdmin: boolean = false;
  convocatoria: IConvocatoria | null = null;
  convocatorias: IConvocatoria[] = [];
  isRegistrationActive = false;
  studentEnrollment: IStudentEnrollmentForm | null = null;
  aspiranteId: string = '';

  constructor(
    private router: Router,
    private callService: CallService,
    private studentEnrollmentService: StudentEnrollmentFormService
  ) {}

  ngOnInit(): void {
    // Obtener todas las convocatorias usando el nuevo método genérico `getAll`
    const token = localStorage.getItem('token');

    this.isAdmin =
      localStorage.getItem('esAdministrador') === 'true' ? true : false;
    this.start();
    if (token) {
      if (this.isAdmin) {
        this.logout();
      }

      this.aspiranteId = localStorage.getItem('aspiranteId')!;
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

  // Método para comprobar si la convocatoria ha finalizado
  isConvocatoriaExpired(endDate: string | Date): boolean {
    const today = new Date();
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    return end < today;
  }

  //metodo traer convocatorias
  start(): void {
    this.callService.getAll().subscribe(
      (response) => {
        if (response.error) {
          console.error('Error al obtener las convocatorias:', response.msg);
          this.convocatorias = [];
        } else {
          console.log(response);

          if (Array.isArray(response.data)) {
            this.convocatorias = response.data.filter(
              (conv: IConvocatoria) => conv.status === true
            );
          } else if (response.data && typeof response.data === 'object') {
            const convocatoria = response.data as IConvocatoria;
            if (convocatoria.status === true) {
              this.convocatorias = [convocatoria];
            } else {
              this.convocatorias = [];
            }
          } else {
            this.convocatorias = [];
          }

          console.log('Convocatorias obtenidas:', this.convocatorias);
        }
      },
      (error) => {
        console.error('Error al obtener las convocatorias', error);
        this.convocatorias = [];
      }
    );
  }

  // Método para iniciar el proceso de registro
  startRegistration(): void {
    this.isRegistrationActive = true;
  }

  // Método para salir del proceso de registro
  exitRegistration(): void {
    this.isRegistrationActive = false;
  }
}
