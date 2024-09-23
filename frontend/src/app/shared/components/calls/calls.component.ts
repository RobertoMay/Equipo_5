import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Convocatoria } from '../../../modules/models'; // Verifica si esta ruta es correcta
import { CallService } from '../../../../services/api/call/call.service'; // Verifica si esta ruta es correcta
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.css']
})

export class CallsComponent implements OnInit {
  @ViewChild('myModal') myModal!: TemplateRef<any>; 
  convocatoria: Convocatoria | null = null;
  convocatorias: Convocatoria[] = [];
  showForm: boolean = false; // Variable para controlar la visualización del formulario

  constructor(private callService: CallService, private modalService: NgbModal) { 
    
  }
  ngOnInit(): void {
    // Obtener todas las convocatorias
    this.callService.getConvocatorias().subscribe(
      data => {
        // Filtrar convocatorias que tienen estado true
        this.convocatorias = data.filter(conv => conv.status === true);
        console.log('Convocatorias obtenidas y filtradas:', this.convocatorias); // Imprime las convocatorias filtradas
      },
      error => {
        console.error('Error al obtener las convocatorias', error);
        this.convocatorias = [];
      }
    );
  }
  abrirModalComentarios(convocatoria: Convocatoria) {
    this.convocatoria = convocatoria;
    this.modalService.open(this.myModal); // Abre el modal
  }
  }
  
  