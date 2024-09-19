import { Component } from '@angular/core';

@Component({
  selector: 'app-resgistration-view',
  templateUrl: './resgistration-view.component.html',
  styleUrls: ['./resgistration-view.component.css']
})
export class ResgistrationViewComponent {
  showFormulario = false; // Propiedad para controlar la visibilidad del formulario

  mostrarFormulario() {
    this.showFormulario = true;
  }
}
