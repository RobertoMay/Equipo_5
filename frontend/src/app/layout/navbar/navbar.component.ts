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
  isMobile: boolean = false;

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
        this.updateHomeState(event.urlAfterRedirects);
        this.checkAuthStatus();

        this.cdr.detectChanges(); // Asegura que se refresque la vista
      }
    });

    // Detectar cambios de historial cuando se hace "Atrás"
    // this.platformlocation.onPopState(() => {
    // this.handleBackNavigation();
    //});
  }



  updateHomeState(currentUrl: string): void {
    // Cuando la URL es '/', es la página de inicio; de lo contrario, no es inicio
   // this.isHome = currentUrl === '/';
    // Verificar si la URL corresponde a páginas principales
  const mainPages = ['/', '/about-us', '/activities', '/registration'];
  
  // Si estás en una página principal y ya estabas autenticado, no cambies el estado
  if (mainPages.includes(currentUrl) && this.isAuthenticated) {
    this.isHome = true;
    return;
  }

  // Comportamiento original
  //this.isHome = currentUrl === '/';
  
   
  }
  

  openLogin() {
    // Verificar si el usuario ya tiene una sesión activa
    if (this.authService.isAuthenticated()) {
      this.isHome = false;
      if (this.authService.isAdmin()) {
        // Si es administrador, redirigir al portal admin
      
        this.router.navigate(['/admin']);
        this.checkAuthStatus(); // Verifica el estado de autenticación de nuevo
        this.cdr.detectChanges(); // Forzar detección de cambios
      } else {
        // Si es estudiante, redirigir al portal student
      
        this.router.navigate(['/student']);
        this.checkAuthStatus(); // Verifica el estado de autenticación de nuevo
        this.cdr.detectChanges(); // Forzar detección de cambios
      }
    } else {
      // Si no hay sesión activa, abrir el modal de login
    
      this.isHome = false;
      this.modalService.openLogin();
    }
  }

  // función para actualizar el estado del navbar
  updateNavbarState() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();
    this.cdr.detectChanges(); // Forzar la actualización del DOM para reflejar el estado actualizado
    
  }

  goToHome(): void {
   

    // Navegamos a la página principal
    this.isHome = true;

    

    // Forzar la actualización del DOM para reflejar los cambios
    this.cdr.detectChanges();
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    // this.isAuthenticated = this.authService.isAuthenticated();
    // this.isAdmin = this.authService.isAdmin();
    this.isMobile = window.innerWidth <= 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });


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

  /*checkAuthStatus() {
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

    
    // this.isHome = false; // Asegurarnos que no estamos en la página de inicio al verificar autenticación
    this.cdr.detectChanges(); // Forzar la actualización del DOM
  }*/

    checkAuthStatus() {
      const token = localStorage.getItem('token');
      
      // Solo actualiza si no hay un estado de autenticación previo
      if (!this.isAuthenticated) {
        this.isAuthenticated = !!token; 
    
        if (this.isAuthenticated) {
          const esAdmin = localStorage.getItem('esAdministrador');
          this.isAdmin = esAdmin === 'true';
        } else {
          this.isAdmin = false;
        }
      }
    
      this.cdr.detectChanges(); 
    }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  showDropdown(menu: 'alumnos' | 'convocatoria' | 'generales') {
    this.dropdowns[menu] = true;
  }
  
  hideDropdown(menu: 'alumnos' | 'convocatoria' | 'generales') {
    this.dropdowns[menu] = false;
  }

  dropdowns = {
    alumnos: false,
    convocatoria: false,
    generales: false, 
  };
  
  toggleDropdown(menu: 'alumnos' | 'convocatoria' | 'generales') {
    this.dropdowns[menu] = !this.dropdowns[menu];
  }

  logout() {
    // Eliminar los datos de sesión
    this.authService.logout();

    // Restablecer el estado del navbar
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isHome = true; // Restablecemos a estado de homepage después del logout

  

    // Forzar la actualización del DOM
    this.cdr.detectChanges();

    // Redireccionar al inicio
    this.router.navigate(['/']);
  }
}
