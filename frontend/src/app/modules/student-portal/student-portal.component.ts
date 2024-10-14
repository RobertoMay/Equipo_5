import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IConvocatoria } from '../../shared/components/calls/icalls.metadata';
import { CallService } from '../../../services/api/call/call.service'; 
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

  constructor(private router: Router,     private callService: CallService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isAdmin =
      localStorage.getItem('esAdministrador') === 'true' ? true : false;

    if (token) {
      if (this.isAdmin) {
        this.logout();
      }
    } else {
      this.logout();
    }
    // Obtener todas las convocatorias usando el nuevo método genérico `getAll`
    this.callService.getAll().subscribe(
      (response) => {
        if (response.error) {
          console.error('Error al obtener las convocatorias:', response.msg);
          this.convocatorias = [];
        } else {
          this.convocatorias =
            response.data?.filter((conv) => conv.status === true) || [];
          console.log(
            'Convocatorias obtenidas y filtradas:',
            this.convocatorias
          );
        }
      },
      (error) => {
        console.error('Error al obtener las convocatorias', error);
        this.convocatorias = [];
      }
    );
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



  // Método para iniciar el proceso de registro
  startRegistration(): void {
    this.isRegistrationActive = true;
  }

  // Método para salir del proceso de registro
  exitRegistration(): void {
    this.isRegistrationActive = false;
  }
}
