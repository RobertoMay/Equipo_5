import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { IConvocatoria } from './icalls.metadata';
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

  abrirModalComentarios(convocatoria: IConvocatoria) {
    this.convocatoria = convocatoria;
    this.modalService.open(this.myModal); // Abre el modal
  }
}
