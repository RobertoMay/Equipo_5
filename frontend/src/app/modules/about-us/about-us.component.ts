
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  // Define el tipo de objeto con claves específicas
  sections: { [key in 'mision' | 'vision' | 'beneficios' | 'responsabilidades']: boolean } = {
    mision: false,
    vision: false,
    beneficios: false,
    responsabilidades: false
  };

  toggle(section: 'mision' | 'vision' | 'beneficios' | 'responsabilidades') {
    this.sections[section] = !this.sections[section];
  }
}