import { Component, HostListener } from '@angular/core';
import { AuthService } from '../services/api/auth/auth.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'albergue';
  constructor(private authService: AuthService) {}

 /*
  
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any): void {
    if (this.authService.isAuthenticated()) {
      const confirmation = confirm('¿Seguro que quieres retroceder?, tendrás que iniciar sesión de nuevo.');
      if (!confirmation) {
        history.pushState(null, '', window.location.href);
      } else {
        this.logout();
      }
    }
  }*/
  

/*
logout(): void {
  // Aquí colocas tu lógica para cerrar sesión
  this.authService.logout();
  // Redirige al usuario a la página de login o la página de inicio
  window.location.href = '/';// Navega a la página de login sin recargar
}*/


}
