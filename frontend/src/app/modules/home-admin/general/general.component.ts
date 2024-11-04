import { Component, OnInit } from '@angular/core';
import { IInfoGeneral } from 'models/iinfo-general.metadata'; 
import { InfoGeneralService } from 'services/api/info-general/info-general.service'; 
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoadingService } from 'services/global/loading.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit{
   // Variables con datos prellenados
   mision: string = 'Nuestra misión actual...';
   vision: string = 'Nuestra visión actual...';
   nombreDirector: string = 'Juan Pérez';

   constructor( private infoGeneralService : InfoGeneralService,
    private _ngxUiLoaderService: NgxUiLoaderService,
    private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.getInfo();
  }
  getInfo(){
    this.loadingService.startLoading();
    this.infoGeneralService.getById('all/').subscribe(
      (response) => {
        if (
          !response.error &&
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          this.loadingService.stopLoading();

          const info = response.data[0];

         
          this.mision = info.mission; 
          this.vision = info.vision;
         this.nombreDirector = info.directorName;

        } else {
          this.loadingService.stopLoading();
          console.log(response.error + ' ' + response.msg);
          setTimeout(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.msg,
            });
          }, 750);
        }
      },
      (error) => {
        this.loadingService.stopLoading();
        console.error(error);
      }
    );
  }
  

 

  guardarCambios() {
    console.log('Misión:', this.mision);
    console.log('Visión:', this.vision);
    console.log('Nombre del Director(a):', this.nombreDirector);
    alert('¡Cambios guardados exitosamente!');
  }
}
