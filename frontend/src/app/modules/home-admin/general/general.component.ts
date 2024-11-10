import { Component, OnInit } from '@angular/core';
import { IInfoGeneral } from 'models/iinfo-general.metadata';
import { InfoGeneralService } from 'services/api/info-general/info-general.service';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoadingService } from 'services/global/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit {
  // Variables con datos prellenados
  mision: string = 'Nuestra misión actual...';
  vision: string = 'Nuestra visión actual...';
  nombreDirector: string = 'C. Carlos';
  isAdmin: boolean = false;
  idGeneral: string = '';

  constructor(
    private infoGeneralService: InfoGeneralService,
    private _ngxUiLoaderService: NgxUiLoaderService,
    private loadingService: LoadingService,
    private router: Router
  ) {}
//valida que el usuario sea el administrador si no lo saca
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isAdmin =
      localStorage.getItem('esAdministrador') === 'true' ? true : false;

    if (token) {
      if (this.isAdmin) {
        this.getInfo();

        this.loadingService.loading$.subscribe((isLoading) => {
          if (isLoading) {
            this._ngxUiLoaderService.start();
          } else {
            this._ngxUiLoaderService.stop();
          }
        });
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('esAdministrador');
    this.isAdmin = false;
    this.router.navigate(['/']);
  }

  getInfo() {
    this.loadingService.startLoading();//esto es el simbolo de garga
    this.infoGeneralService.getById('all/').subscribe(
      (response) => {
        if (
          !response.error &&
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          this.loadingService.stopLoading();

          const info = response.data[0];//crea una variable llamada info y se guarda la data que trae el back 

          this.mision = info.mission;//esto pinta la informacion que trae el back en variable mision
          this.vision = info.vision;//esto pinta la informacion que trae el back en variable vision
          this.nombreDirector = info.directorName;//esto pinta la informacion que trae el back la variable nombreDirector
          this.idGeneral = info.id; 
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
//metodo para el boton guardar, pero aun no funciona 
  guardarCambios() {
    const objeto = {
      mission:this.mision,
      vision:this.vision,
      directorName: this.nombreDirector,
    }
    //response es lo que trae el back
    this.loadingService.startLoading();//esto es el simbolo de garga
    this.infoGeneralService.update('updateInfo/'  + this.idGeneral, objeto ).subscribe(
      (response) => {
        if ( //valida que el if tiene informacion si no marca error
          response.error === false //Valida que la actualizacion fue correcta
        ) {
          this.loadingService.stopLoading(); // se tetiene el simbolo de carga
          //muestra la ventanita emergente que dice que se ha actualizado corectamente la informacion requerida
          setTimeout(() => {
            Swal.fire({
              title: response.msg,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          }, 750);
          
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
}
