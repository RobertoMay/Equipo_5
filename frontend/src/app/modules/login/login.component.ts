import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/api/auth/auth.service'; // Importar el AuthService
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { Router } from '@angular/router'; // Para manejar redirección
import { ILogin } from 'app/modules/login/ilogin-form.metadata'; // Para manejar el modelo de login
import { ModalLoginService } from 'services/api/modalloginservice/modal-login.service';
import { RegistrationService } from '../../../services/api/registration/registration.service'; // Importar el RegistrationService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  showLogin: boolean = true; // Controla si el pop-up se muestra
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private registrationService: RegistrationService,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private modalLoginService: ModalLoginService
  ) {
    console.log('LoginComponent initialized');
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      curp: ['', [Validators.required, Validators.minLength(18)]],
    });
  }

  get fm() {
    return this.form.controls;
  }

  sendData() {
    console.log(this.form.value);
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

        // Guardar el token y esAdministrador
        localStorage.setItem('token', response.token || '');
        localStorage.setItem(
          'esAdministrador',
          response.esAdministrador ? 'true' : 'false'
        );
        localStorage.setItem('idUsuario', response.id || '');
        console.log('token:', response.token);
        console.log('esAdministrador:', response.esAdministrador);
        // Actualizar el estado de autenticación y rol
        this.authService.updateAuthStatus(); // Llama al método para actualizar el navbar

        // Obtener el ID del aspirante usando su CURP
        this.registrationService
          .getAspiranteByCurp(this.form.value.curp)
          .subscribe({
            next: (aspiranteResponse) => {
              // Aquí obtienes el ID del aspirante
              console.log('ID del aspirante:', aspiranteResponse.aspiranteId);
              // Guardar el ID del aspirante en localStorage
              localStorage.setItem(
                'aspiranteId',
                aspiranteResponse.aspiranteId
              );
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
          timer: 1500,
          showConfirmButton: false,
        });

        // Redireccionar dependiendo del rol
        if (response.esAdministrador) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/student']);
        }
        // Ocultar el modal de login
        this.modalLoginService.closeLogin();
      },
      error: (err) => {
        this.ngxLoader.stop(); // Detener el cargador
        // Manejar errores
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema, por favor intenta nuevamente.',
        });
      },
    });
  }

  ngOnInit() {
    // Suscribe a las actualizaciones del estado de `showLogin`
    this.modalLoginService.showLogin$.subscribe((show) => {
      this.showLogin = show;
      console.log('LoginComponent: showLogin is', show);

      if (show) {
        // Resetea el formulario cada vez que se abre el login
        this.form.reset();
        this.submitted = false; // Resetear el estado del formulario
      }
    });
  }

  closeLogin() {
    this.form.reset(); // Limpia el formulario
    this.modalLoginService.closeLogin(); // Cierra el modal usando el servicio
  }

  togglePasswordVisibility(passwordInput: HTMLInputElement) {
    // Guardar la posición actual del cursor
    const selectionStart = passwordInput.selectionStart;
    const selectionEnd = passwordInput.selectionEnd;

    this.showPassword = !this.showPassword;
    
 // Usamos setTimeout para asegurar que la operación ocurra después del cambio de tipo
 setTimeout(() => {
  passwordInput.focus();
  // Restauramos la posición del cursor
  passwordInput.setSelectionRange(selectionStart, selectionEnd);
}, 0);

  }
}
