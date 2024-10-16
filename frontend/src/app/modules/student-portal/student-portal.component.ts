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
    // Obtener todas las convocatorias usando el nuevo método genérico `getAll`
   
    const token = localStorage.getItem('token');
    this.isAdmin =
      localStorage.getItem('esAdministrador') === 'true' ? true : false;
this.start();
    if (token) {
      if (this.isAdmin) {
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

  // Método para comprobar si la convocatoria ha finalizado
isConvocatoriaExpired(endDate: string | Date): boolean {
    const today = new Date();
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    return end < today;
}

//metodo traer convocatorias
start():void{
  this.callService.getAll().subscribe(
    (response) => {
      if (response.error) {
        console.error('Error al obtener las convocatorias:', response.msg);
        this.convocatorias = [];
      } else {
        if (Array.isArray(response.data)) {
          this.convocatorias = response.data.filter(
            (conv: IConvocatoria) => conv.status === true
          );
        } else if (
          response.data &&
          (response.data as IConvocatoria).status === true
        ) {
          this.convocatorias = [response.data as IConvocatoria];
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
