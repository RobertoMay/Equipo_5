import { Component, OnInit } from '@angular/core';
import { InfoGeneralService } from 'services/api/info-general/info-general.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent implements OnInit {
  // Define el tipo de objeto con claves específicas
  sections: {
    [key in 'mision' | 'vision' | 'beneficios' | 'responsabilidades']: boolean;
  } = {
    mision: false,
    vision: false,
    beneficios: false,
    responsabilidades: false,
  };
  mision: string =
    'Casa Comunitaria, en estrecha colaboración con el Instituto Nacional de los Pueblos Indígenas (INPI), tiene como misión primordial consolidarse como un epicentro de empoderamiento y desarrollo integral para las comunidades indígenas. Nos comprometemos a facilitar el acceso a recursos, servicios y oportunidades que fortalezcan las capacidades de los beneficiarios, preservando sus tradiciones culturales y fomentando la inclusión social.';
  vision: string =
    'Aspiramos a ser un modelo de gestión comunitaria respaldado por el INPI, destacando por nuestra eficiencia en la canalización de recursos, la implementación de programas innovadores y la promoción de la autodeterminación. Buscamos impulsar un cambio significativo en la calidad de vida de las comunidades, contribuyendo a la construcción de un futuro donde la autosuficiencia y el bienestar sean la norma.';

  constructor(private infoGeneralService: InfoGeneralService) {}

  toggle(section: 'mision' | 'vision' | 'beneficios' | 'responsabilidades') {
    this.sections[section] = !this.sections[section];
  }

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo() {
    this.infoGeneralService.getById('all/').subscribe(
      (response) => {
        if (
          !response.error &&
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const info = response.data[0];

          this.mision = info.mission;
          this.vision = info.vision;
        } else {
          console.log(response.error + ' ' + response.msg);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
