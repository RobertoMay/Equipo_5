import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from 'services/api/enrollment-period/enrollment-period.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css'],
})
export class HomeAdminComponent implements OnInit {
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.enrollmentService.getAll().subscribe(
      (response) => {
        if (response.error) {
          console.error('Error al obtener las convocatorias:', response.msg);
        } else {
          const data = response.data;
          if (data) {
            console.log('Datos obtenidos:', data);
          } else {
            console.warn('No se encontraron datos');
          }
        }
      },
      (error) => {
        console.error('Error al obtener las convocatorias', error);
      }
    );
  }
}
