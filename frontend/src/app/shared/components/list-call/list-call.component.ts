import { Component, OnInit } from '@angular/core';
import { CallService } from 'services/api/call/call.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-call',
  templateUrl: './list-call.component.html',
  styleUrls: ['./list-call.component.css'],
})
export class ListCallComponent implements OnInit {
  callsHistory: any[] = [];
  filteredCalls: any[] = [];
  filterYear?: number;

  constructor(
    private callService: CallService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.loadCalls();
    this.callService.callCreated$.subscribe(() => this.reloadCalls());
  }

  reloadCalls(): void {
    this.loadCalls();
  }

  loadCalls(): void {
    this.ngxLoader.start();
    this.callService.getAllAnnouncements().subscribe({
      next: (data) => {
        this.callsHistory = data.convocatorias;
        this.filteredCalls = [...this.callsHistory];
        this.callsHistory.sort((a, b) => {
          if (a.status && !b.status) return -1;
          if (!a.status && b.status) return 1;
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        });
        this.ngxLoader.stop();
      },
      error: () => {
        this.ngxLoader.stop();
      },
    });
  }

  formatDate(date: string | Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString('es-ES', options);
  }

  applyYearFilter(): void {
    if (this.filterYear) {
      this.filteredCalls = this.callsHistory.filter((call) => {
        const startYear = new Date(call.startDate).getFullYear();
        const endYear = new Date(call.endDate).getFullYear();
        return startYear === this.filterYear || endYear === this.filterYear;
      });
    } else {
      this.filteredCalls = [...this.callsHistory];
    }
  }

  resetFilter(): void {
    this.filterYear = undefined;
    this.filteredCalls = [...this.callsHistory];
  }

  deleteCall(callToDelete: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la convocatoria.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.callService.delete(callToDelete.id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'La convocatoria ha sido eliminada.',
              'success'
            );
            this.reloadCalls();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la convocatoria.', 'error');
          },
        });
      }
    });
  }
}
