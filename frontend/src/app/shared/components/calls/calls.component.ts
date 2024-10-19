import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { IConvocatoria } from '../../../../models/icalls.metadata';
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
  convocatorias: IConvocatoria[] = [];
  showForm: boolean = false; // Variable para controlar la visualización del formulario

  constructor(
    private callService: CallService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
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
}
