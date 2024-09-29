import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/api/auth/auth.service'; // Importar el AuthService
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { Router } from '@angular/router'; // Para manejar redirección
import { ILogin } from 'app/modules/login/ilogin-form.metadata'; // Para manejar el modelo de login


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  
  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
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
        localStorage.setItem('token', response.token || '');
console.log('token:' + response.token );
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

  

}
