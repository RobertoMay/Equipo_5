import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // Importar Router y NavigationEnd
import { LoginComponent } from "@modules/login/login.component";
import {  ViewChild } from '@angular/core';
import { ModalLoginService } from "services/api/modalloginservice/modal-login.service";
import { AuthService } from 'services/api/auth/auth.service'; // Importar AuthService

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

  constructor(private router: Router,
    private modalService: ModalLoginService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef  // Inyectar ChangeDetectorRef
  ) {

 // Verificar estado de autenticación al cargar el componente
 //this.checkAuthStatus();

    // Suscribirse a los eventos de navegación para cerrar el menú en móviles
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Cerrar el menú cuando la navegación finalice
        this.isMenuOpen = false;

        this.checkAuthStatus();
      }
    });
  }


    openLogin() {
    console.log('openLogin() called from Navbar');
    this.modalService.openLogin();
  }



  ngOnInit() {
    // Suscribirse a los cambios en el estado de autenticación
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.cdr.detectChanges(); // Forzar detección de cambio
    });

    // Suscribirse a los cambios en el rol de administrador
    this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      this.cdr.detectChanges(); // Forzar detección de cambio
    });

    // Verificar el estado inicial
    this.authService.updateAuthStatus();
  }






 // Método para verificar el estado de autenticación
 checkAuthStatus() {
  const token = localStorage.getItem('token');
  this.isAuthenticated = !!token; // True si el token existe

    if (this.isAuthenticated) {
      // Verificar si el usuario es administrador
      const esAdmin = localStorage.getItem('esAdministrador');
      console.log('esAdmin:', esAdmin); // Verifica lo que se almacena aquí
      this.isAdmin = esAdmin === 'true'; // Asignar el valor booleano
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    // Aquí se puede realizar la lógica para cerrar sesión, como eliminar el token
   
    this.authService.logout();
    this.router.navigate(['/']);
    this.authService.updateAuthStatus();
    
   // this.isAuthenticated = false; // Actualizar estado
   // this.isAdmin = false; // Actualizar estado


   /* localStorage.removeItem('token');
    localStorage.removeItem('esAdministrador');
    this.isAuthenticated = false; // Actualizar estado
    this.isAdmin = false; // Actualizar estado
    this.router.navigate(['/']); // Redireccionar a la página de inicio*/


  }


}
