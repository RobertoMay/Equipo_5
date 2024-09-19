import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Convocatoria } from '../../../modules/models'; // Verifica si esta ruta es correcta
import { CallService } from '../../../../services/call.service'; // Verifica si esta ruta es correcta

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.css']
})
export class CallsComponent implements OnInit {
  convocatoria: Convocatoria | null = null;
  convocatorias: Convocatoria[] = [];
  showForm: boolean = false; // Variable para controlar la visualización del formulario

  constructor(private callService: CallService) { 
    
  }
  ngOnInit(): void {
    // Obtener todas las convocatorias
    this.callService.getConvocatorias().subscribe(
      data => {
        // Filtrar convocatorias que tienen estado true
        this.convocatorias = data.filter(conv => conv.estado === true);
        console.log('Convocatorias obtenidas y filtradas:', this.convocatorias); // Imprime las convocatorias filtradas
      },
      error => {
        console.error('Error al obtener las convocatorias', error);
        this.convocatorias = [];
      }
    );
  }
  @Output() onSelect = new EventEmitter<void>();
  
 // Método para manejar el clic en una convocatoria
 handleConvocatoriaClick() {
  this.onSelect.emit(); // Emite el evento cuando se hace clic
}
}
