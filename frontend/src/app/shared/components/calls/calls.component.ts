import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  IConvocatoria,
  IConvocatoriaResponse,
} from '../../../../models/icalls.metadata';
import { CallService } from '../../../../services/api/call/call.service'; // Verifica si esta ruta es correcta
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.css'],
})
export class CallsComponent implements OnInit {
  @ViewChild('myModal') myModal!: TemplateRef<any>;
  convocatoria: IConvocatoria | null = null;

  showForm: boolean = false; // Variable para controlar la visualización del formulario

  constructor(
    private callService: CallService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.callService.getCurrentAnnouncement().subscribe({
      next: (convocatoria) => {
        if (convocatoria) {
          this.convocatoria = (
            convocatoria as unknown as IConvocatoriaResponse
          ).convocatoria;
        } else {
          console.warn('No se encontró ninguna convocatoria actual');
          this.convocatoria = null;
        }
      },
      error: (error) => {
        this.convocatoria = null; // Asegúrate de manejar el error adecuadamente
      },
    });
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  abrirModalComentarios(convocatoria: IConvocatoria) {
    this.convocatoria = convocatoria;
    this.modalService.open(this.myModal); // Abre el modal
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
