import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // Importar Router y NavigationEnd

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isMenuOpen = false;
  isAuthenticated: boolean = false; // Estado de autenticación
  isAdmin: boolean = false; // Estado del rol de usuario

  constructor(private router: Router) {
    // Verificar estado de autenticación al cargar el componente
    const currentUrl = this.router.url;
    console.log(currentUrl);

    this.checkAuthStatus();

    // Suscribirse a los eventos de navegación para cerrar el menú en móviles
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Cerrar el menú cuando la navegación finalice
        this.isMenuOpen = false;

        this.checkAuthStatus();
      }
    });
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
    localStorage.removeItem('token');
    localStorage.removeItem('esAdministrador');
    this.isAuthenticated = false; // Actualizar estado
    this.isAdmin = false; // Actualizar estado
    this.router.navigate(['/']); // Redireccionar a la página de inicio
  }
}
