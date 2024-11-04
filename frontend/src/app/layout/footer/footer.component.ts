import { Component, OnInit } from '@angular/core';
import { InfoGeneralService } from 'services/api/info-general/info-general.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'], // Cambia styleUrl a styleUrls
})
export class FooterComponent implements OnInit {
  nombreDirector: string = 'C. Carlos';

  constructor(private infoGeneralService: InfoGeneralService) {}

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

          this.nombreDirector = info.directorName;
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
