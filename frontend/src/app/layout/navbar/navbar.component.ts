import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router'; // Importar Router y NavigationEnd
import { LoginComponent } from '@modules/login/login.component';
import { ViewChild } from '@angular/core';
import { ModalLoginService } from 'services/api/modalloginservice/modal-login.service';
import { AuthService } from 'services/api/auth/auth.service'; // Importar AuthService
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  //@ViewChild(LoginComponent) loginComponent!: LoginComponent;
  isMenuOpen = false;
  isAuthenticated: boolean = false; // Estado de autenticación
  isAdmin: boolean = false; // Estado del rol de usuario
  isHome: boolean = true;
  constructor(
    private router: Router,
    private modalService: ModalLoginService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // Inyectar ChangeDetectorRef
  ) //private platformlocation: PlatformLocation
  {
    // Suscribirse a los eventos de navegación para cerrar el menú en móviles
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Cerrar el menú cuando la navegación finalice
        this.isMenuOpen = false;

        this.checkAuthStatus();

        this.cdr.detectChanges(); // Asegura que se refresque la vista
      }
    });

    // Detectar cambios de historial cuando se hace "Atrás"
    // this.platformlocation.onPopState(() => {
    // this.handleBackNavigation();
    //});
  }

  // Método para manejar la navegación al hacer "Atrás"
  /*handleBackNavigation() {
  const currentUrl = this.router.url;

  // Si ya estás en la página principal y el navbar está en estado general
  if (currentUrl === '/' && this.isHome) {
    console.log('Ya estás en la página principal, no se realiza ningún cambio.');
    return; // No realizar ningún cambio si ya está en el estado general
  }

  // Si navegas a la página principal, establecer isHome a true
  if (currentUrl === '/') {
    this.isHome = true;
    console.log('Navegación hacia atrás detectada: isHome = true');
  } else {
    this.isHome = false;
    console.log('Navegación hacia atrás detectada: isHome = false');
  }

  this.checkAuthStatus();
  this.cdr.detectChanges();  // Forzar actualización de la vista
}*/

  openLogin() {
    // Verificar si el usuario ya tiene una sesión activa
    if (this.authService.isAuthenticated()) {
      this.isHome = false;
      if (this.authService.isAdmin()) {
        // Si es administrador, redirigir al portal admin
        console.log(
          'Usuario autenticado como administrador, redirigiendo a /admin'
        );
        this.router.navigate(['/admin']);
        this.checkAuthStatus(); // Verifica el estado de autenticación de nuevo
        this.cdr.detectChanges(); // Forzar detección de cambios
      } else {
        // Si es estudiante, redirigir al portal student
        console.log(
          'Usuario autenticado como estudiante, redirigiendo a /student'
        );
        this.router.navigate(['/student']);
        this.checkAuthStatus(); // Verifica el estado de autenticación de nuevo
        this.cdr.detectChanges(); // Forzar detección de cambios
      }
    } else {
      // Si no hay sesión activa, abrir el modal de login
      console.log(
        'No hay sesión activa, abriendo el modal de inicio de sesión'
      );
      this.isHome = false;
      this.modalService.openLogin();
    }
  }

  // función para actualizar el estado del navbar
  updateNavbarState() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();
    this.cdr.detectChanges(); // Forzar la actualización del DOM para reflejar el estado actualizado
    console.log(
      'Estado actualizado: isAuthenticated:',
      this.isAuthenticated,
      'isAdmin:',
      this.isAdmin
    );
  }

  goToHome(): void {
    console.log(
      'Redirigiendo a la página principal: Navbar general (sin sesión activa)'
    );

    // Navegamos a la página principal
    this.isHome = true;

    console.log('goToHome: isAuthenticated:', this.isAuthenticated);
    console.log('goToHome: isAdmin:', this.isAdmin);
    console.log('goToHome: isHome:', this.isHome);

    // Forzar la actualización del DOM para reflejar los cambios
    this.cdr.detectChanges();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    // this.isAuthenticated = this.authService.isAuthenticated();
    // this.isAdmin = this.authService.isAdmin();
    this.checkAuthStatus(); // Verifica el estado de autenticación inicial
    this.cdr.detectChanges(); // Forzar la actualización del DOM al iniciar
  }

  ngOnChanges() {
    // Forzar la actualización del estado de autenticación y rol cuando cambien
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();

    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }

  checkAuthStatus() {
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token; // True si el token existe

    if (this.isAuthenticated) {
      // Verificar si el usuario es administrador
      const esAdmin = localStorage.getItem('esAdministrador');
      this.isAdmin = esAdmin === 'true';
    } else {
      // Restablecemos el estado si no está autenticado
      this.isAdmin = false;
    }

    console.log('checkAuthStatus: isAuthenticated:', this.isAuthenticated);
    console.log('checkAuthStatus: isAdmin:', this.isAdmin);
    console.log('checkAuthStatus: isHome:', this.isHome);
    // this.isHome = false; // Asegurarnos que no estamos en la página de inicio al verificar autenticación
    this.cdr.detectChanges(); // Forzar la actualización del DOM
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    // Eliminar los datos de sesión
    this.authService.logout();

    // Restablecer el estado del navbar
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isHome = true; // Restablecemos a estado de homepage después del logout

    console.log('logout: isAuthenticated:', this.isAuthenticated);
    console.log('logout: isAdmin:', this.isAdmin);
    console.log('logout: isHome:', this.isHome);

    // Forzar la actualización del DOM
    this.cdr.detectChanges();

    // Redireccionar al inicio
    this.router.navigate(['/']);
  }
}
