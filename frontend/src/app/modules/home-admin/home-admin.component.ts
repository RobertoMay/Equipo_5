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
  ApexDataLabels
} from 'ng-apexcharts';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
import { AdminDashboardData } from 'models/admin-dashboard.model';
import { AdminDashboardService } from 'services/api/admin-dashboard/admin-dashboard.service';
import { Router } from '@angular/router';

export type ChartOptions = {
  /*series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  legend: ApexLegend;
  total: ApexNonAxisChartSeries;*/
  series: ApexNonAxisChartSeries | ApexAxisChartSeries;
  chart: ApexChart;
  responsive?: ApexResponsive[];
  labels?: string[];
  legend?: ApexLegend;
  total?: ApexNonAxisChartSeries;
  totalInscritos?: number; // Nuevo campo para total de inscritos
  xaxis?: ApexXAxis; // Agregar propiedad xaxis
  dataLabels?: ApexDataLabels; // Para etiquetas


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
  public generoOptions: Partial<ChartOptions> | undefined;

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
    // Gráfica de inscritos
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
      totalInscritos: data.alumnos.inscritos, // Total de alumnos inscritos
    };
// Gráfica de documentos
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
// Gráfica de albergue
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
     
     // Gráfica de albergue
  this.albergueOptions = {
    series: [data.albergue.plazasOcupadas, data.albergue.plazasDisponibles],
    chart: { type: 'pie', height: 330 },
    labels: ['Ocupadas', 'Disponibles'],
    legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '16px' },
    total: [data.albergue.cupoTotal],
  };

  // Gráfica de género
  this.generoOptions = {
    series: [
      {
        name: 'Cantidad de estudiantes', // Nombre de la serie
        data: [
          data.distribucionGenero.hombresInscritos,
          data.distribucionGenero.mujeresInscritos,
          data.distribucionGenero.otrosInscritos,
        ],
      },
    ],
    chart: { type: 'bar', height: 350 },
    labels: ['Hombres', 'Mujeres', 'Otro'],
    xaxis: {
      categories: ['Hombres', 'Mujeres', 'Otro'],
      title: { text: 'Género' },
    },
    legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '16px' },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        // Calcular el porcentaje
        const total = data.distribucionGenero.hombresInscritos +
                      data.distribucionGenero.mujeresInscritos +
                      data.distribucionGenero.otrosInscritos;
        const percentage = ((val / total) * 100).toFixed(1);
        return `${percentage}%`; // Mostrar el porcentaje
      },
      style: {
        colors: ['#000'], // Color del texto 
      },
    
   
    },

  


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
