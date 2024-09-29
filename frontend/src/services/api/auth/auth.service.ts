import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericServiceService } from '@shared/generic.service.service';
import { ILogin } from 'app/modules/login/ilogin-form.metadata';
import { ILoginResponse } from 'app/modules/login/ilogin-response.metadata'; 
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/aspirante'; // URL base del backend

  constructor(private http: HttpClient) {}

  // Método específico para login
  auth(credentials: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(
      `${this.baseUrl}/login`, // Enlace de la API
      credentials // Datos enviados al backend: { correo, curp }
    );
  }
}