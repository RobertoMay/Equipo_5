import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/api/auth/auth.service'; // Importar el AuthService
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { Router } from '@angular/router'; // Para manejar redirección
import { ILogin } from 'app/modules/login/ilogin-form.metadata'; // Para manejar el modelo de login
import { RegistrationService } from '../../../services/api/registration/registration.service'; // Importar el RegistrationService


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  
  form: FormGroup;
  submitted = false;
  showLogin: boolean = true; // Controla si el pop-up se muestra

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private registrationService: RegistrationService,
    private ngxLoader: NgxUiLoaderService,
    private router: Router
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      curp: ['', [Validators.required, Validators.minLength(18)]],
    });
  }

  get fm() {
    return this.form.controls;
  }

  sendData() {
    console.log(this.form.value)
    this.submitted = true; // Marca como enviado

    // Si el formulario no es válido, detener la ejecución
    if (this.form.invalid) {
      return;
    }

    // Mostrar cargador
    this.ngxLoader.start();

    // Enviar datos al servicio
    this.authService.auth(this.form.value).subscribe({
      next: (response) => {
        this.ngxLoader.stop(); // Detener el cargador
        console.log(response); 
      
        console.log(response.nombresCompletos); // Verifica específicamente 'nombresCompletos'

        if (response.message !== 'Inicio de sesión exitoso') {
          // Mostrar mensaje de error con SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message,
          });
          return;
        }

        // Guardar el token
       // localStorage.setItem('token', response.token || '');
       // console.log('token:' + response.token );


// Guardar el token y esAdministrador
localStorage.setItem('token', response.token || '');
localStorage.setItem('esAdministrador', response.esAdministrador ? 'true' : 'false');
console.log('token:', response.token);
console.log('esAdministrador:', response.esAdministrador);


  // Obtener el ID del aspirante usando su CURP
  this.registrationService.getAspiranteByCurp(this.form.value.curp).subscribe({
    next: (aspiranteResponse) => {
      // Aquí obtienes el ID del aspirante
      console.log('ID del aspirante:', aspiranteResponse.aspiranteId);
      // Guardar el ID del aspirante en localStorage
      localStorage.setItem('aspiranteId', aspiranteResponse.aspiranteId);
    },
    error: (err) => {
      console.error('Error obteniendo el ID del aspirante:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el ID del aspirante.',
      });
    },
  });

  

        // Mostrar mensaje de éxito con SweetAlert
        Swal.fire({
          icon: 'success',
          title: '¡Inicio de sesión exitoso!',
          text: `Bienvenido ${response.nombresCompletos}`,
        });

        // Redireccionar dependiendo del rol
        if (response.esAdministrador) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/student']);
        }


        this.showLogin = false; // Oculta el pop-up después de iniciar sesión
      },
      error: (err) => {
        this.ngxLoader.stop(); // Detener el cargador
        // Manejar errores
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema, por favor intenta nuevamente.',
        });
      }
    });
  }

  closeLogin() {
    this.showLogin = false; // Cierra el pop-up al hacer clic en el botón de cerrar
    this.router.navigate(['/']);
  }

  

}
