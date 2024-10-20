import { Injectable } from '@angular/core';
import { Observable , BehaviorSubject} from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ILogin } from 'app/modules/login/ilogin-form.metadata';
import { ILoginResponse } from 'app/modules/login/ilogin-response.metadata'; 
import { Token } from '@angular/compiler';
import { GenericServiceService } from '@shared/generic.service.service';
@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private baseUrl = 'http://localhost:3000/api/aspirante'; // URL base del backend

  // Variables observables para el estado de autenticación y rol
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  private isAdminSubject = new BehaviorSubject<boolean>(this.isAdmin());

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();


  constructor(private http: HttpClient) {}

  // Método específico para login
  auth(credentials: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(
      `${this.baseUrl}/login`, // Enlace de la API
      credentials // Datos enviados al backend: { correo, curp }
    );
  }

// Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }


// Método para verificar si el usuario es administrador
  isAdmin(): boolean {
    const esAdmin = localStorage.getItem('esAdministrador');
    return esAdmin === 'true';
  }



 // Actualizar el estado de autenticación y rol
 updateAuthStatus() {
  console.log('Updating Auth Status');
  this.isAuthenticatedSubject.next(this.isAuthenticated());
  this.isAdminSubject.next(this.isAdmin());
}


   // Método para cerrar sesión
   logout() {
    // Eliminar el token y el rol de administrador del almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('esAdministrador');
    
// Emitir (enviar) el nuevo estado: no autenticado y no admin
this.isAuthenticatedSubject.next(false);  // El usuario ya no está autenticado
this.isAdminSubject.next(false);          // Ya no es admin

// Llamar a updateAuthStatus para asegurar la actualización en el navbar
this.updateAuthStatus();
 
  }


  

}