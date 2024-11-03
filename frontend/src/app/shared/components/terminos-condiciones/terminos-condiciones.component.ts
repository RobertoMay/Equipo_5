import { Component,  Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.css']
})
export class TerminosCondicionesComponent {
  @Output() termsAccepted = new EventEmitter<boolean>();

  acceptTerms() {
    this.termsAccepted.emit(true); // Emite el evento cuando se aceptan los términos
    console.log(this.termsAccepted);
  }
}