import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  // Define el tipo de objeto con claves específicas
  sections: { [key in 'mision' | 'vision' | 'politicas' | 'lineas']: boolean } = {
    mision: false,
    vision: false,
    politicas: false,
    lineas: false
  };

  toggle(section: 'mision' | 'vision' | 'politicas' | 'lineas') {
    this.sections[section] = !this.sections[section];
  }
}
