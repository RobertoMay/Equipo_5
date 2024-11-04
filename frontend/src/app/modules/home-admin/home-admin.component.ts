import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexResponsive,
  ApexNonAxisChartSeries,
  ApexLegend,
} from 'ng-apexcharts';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
import { AdminDashboardData } from 'models/admin-dashboard.model';
import { AdminDashboardService } from 'services/api/admin-dashboard/admin-dashboard.service';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  legend: ApexLegend;
  total: ApexNonAxisChartSeries;
};

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css'],
})
export class HomeAdminComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent | any;
  //public chartOptions: Partial<ChartOptions>;

  public promotorName: string = '';
  public dataLoaded: boolean = false;
  public inscritosOptions: Partial<ChartOptions> | undefined;
  public documentosOptions: Partial<ChartOptions> | undefined;
  public albergueOptions: Partial<ChartOptions> | undefined;
  isAdmin: boolean = false;

  constructor(
    private ngxLoader: NgxUiLoaderService,
    private dashboardService: AdminDashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isAdmin =
      localStorage.getItem('esAdministrador') === 'true' ? true : false;

    if (token) {
      if (this.isAdmin) {
        this.ngxLoader.start();

        this.dashboardService.getDashboardData().subscribe(
          (data: AdminDashboardData) => {
            console.log('Datos del backend:', data); // Verificar datos aquí
            this.promotorName = data.adminName;
            this.setChartOptions(data);
            this.dataLoaded = true;
            this.ngxLoader.stop(); // Detiene la pantalla de carga cuando se reciben los datos
          },
          (error) => {
            console.error('Error al cargar los datos del dashboard:', error);
            this.ngxLoader.stop(); // Detiene la pantalla de carga en caso de error
          }
        );
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  private setChartOptions(data: AdminDashboardData): void {
    this.inscritosOptions = {
      series: [data.alumnos.inscritos, data.alumnos.porInscribirse],
      chart: { type: 'pie', height: 330 },
      labels: ['Alumnos inscritos', 'Alumnos en proceso de inscripción'],

      legend: {
        position: 'bottom', // Posiciona las etiquetas debajo del pastel
        horizontalAlign: 'center',
        floating: false,
        fontSize: '16px',
      },
      total: [data.alumnos.total], // Total de alumnos
    };

    this.documentosOptions = {
      series: [data.documentos.completos, data.documentos.pendientes],
      chart: { type: 'pie', height: 330 },
      labels: ['Con documentos Completos', 'Con documentos pendientes'],

      legend: {
        position: 'bottom', // Posiciona las etiquetas debajo del pastel
        horizontalAlign: 'center',
        fontSize: '15.4px',
      },
      total: [data.documentos.porInscribirse], // Total de documentos por inscribirse
    };

    this.albergueOptions = {
      series: [data.albergue.plazasOcupadas, data.albergue.plazasDisponibles],
      chart: { type: 'pie', height: 330 },
      labels: ['Ocupadas', 'Disponibles'],
      legend: {
        position: 'bottom', // Posiciona las etiquetas debajo del pastel
        horizontalAlign: 'center',
        fontSize: '16px',
      },
      total: [data.albergue.cupoTotal], // Cupo total del albergue
    };
  }

  private showError() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los datos. Intente de nuevo más tarde.',
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('esAdministrador');
    this.isAdmin = false;
    this.router.navigate(['/']);
  }
}
