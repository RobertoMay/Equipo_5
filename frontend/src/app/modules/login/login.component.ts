import { Component } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  constructor(private ngxService: NgxUiLoaderService) {}

  iniciarSesion() {
    this.ngxService.start(); // Inicia el loader
    // Lógica de autenticación


    setTimeout(() => {
      // Aquí va la lógica de autenticación
      // Detiene el loader después del tiempo simulado o de la respuesta
      this.ngxService.stop();
    }, 3000); //



  // Detiene el loader después de recibir la respuesta
  }

}
