import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IConvocatoria,
  IConvocatoriaResponse,
} from '../../../models/icalls.metadata';
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
  isRegistrationActive = false;
  studentEnrollment: IStudentEnrollmentForm | null = null;
  aspiranteId: string = '';

  constructor(
    private router: Router,
    private callService: CallService,
    private studentEnrollmentService: StudentEnrollmentFormService
  ) {}

  ngOnInit(): void {
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
    this.callService.getCurrentAnnouncement().subscribe({
      next: (convocatoria) => {
        if (convocatoria) {
          this.convocatoria = (
            convocatoria as unknown as IConvocatoriaResponse
          ).convocatoria;

          // Convertir las fechas al formato deseado y guardarlas en localStorage
          const formattedStartDate = this.formatDate(
            this.convocatoria.startDate
          );
          const formattedEndDate = this.formatDate(this.convocatoria.endDate);
          const statusEnrollment = `${formattedStartDate} - ${formattedEndDate}`;

          localStorage.setItem('statusenrollment', statusEnrollment);
        } else {
          console.warn('No se encontró ninguna convocatoria actual');
          this.convocatoria = null;
        }
      },
      error: (error) => {
        console.error('Error al obtener la convocatoria actual:', error);
        this.convocatoria = null; // Asegúrate de manejar el error adecuadamente
      },
    });
  }

  // Método para iniciar el proceso de registro
  startRegistration(): void {
    this.isRegistrationActive = true;
  }

  // Método para salir del proceso de registro
  exitRegistration(): void {
    this.isRegistrationActive = false;
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  isAnnouncementClosed(): boolean {
    if (this.convocatoria) {
      const endDate = new Date(this.convocatoria.endDate);
      const today = new Date();
      const timeDiff = endDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff < 0; // Devuelve true si la convocatoria está cerrada
    }
    return false;
  }

  isAnnouncementClosedRecently(): boolean {
    if (!this.convocatoria || !this.convocatoria.endDate) {
      return false;
    }

    const today = new Date();
    const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
    const endDate = new Date(this.convocatoria.endDate);

    // Si la fecha de cierre es anterior a hace 7 días, mostrar el template de no convocatoria
    return endDate < sevenDaysAgo;
  }
}
