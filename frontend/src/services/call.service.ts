import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Convocatoria } from '../app/modules/models'; // Asegúrate de que esta ruta sea correcta
import { environment } from '../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  private myAppUrl: string;
  private apiUrl : string;  // URL de la API base

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.apiUrl = '/convocatorias/'
   }

  // Método para obtener todas las convocatorias
  getConvocatorias(): Observable<Convocatoria[]> {
    console.log('Llamada al servicio para obtener convocatorias'); // Agrega este log
    return this.http.get<Convocatoria[]>(`${this.myAppUrl}${this.apiUrl}`);
  }

  // Método para obtener una convocatoria por ID
  getConvocatoriaById(id: string): Observable<Convocatoria> {
    return this.http.get<Convocatoria>(`${this.apiUrl}/${id}`);
  }

  // Método para obtener una convocatoria por título
  getConvocatoriaByTitle(titulo: string): Observable<Convocatoria> {
    const params = new HttpParams().set('titulo', titulo);
    return this.http.get<Convocatoria>(`${this.apiUrl}`, { params });
  }

  // Método para eliminar convocatorias por título
  deleteConvocatoriaByTitle(titulo: string): Observable<any> {
    const params = new HttpParams().set('titulo', titulo);
    return this.http.delete(`${this.apiUrl}`, { params });
  }

  // Método para actualizar convocatorias por título
  updateConvocatoriaByTitle(titulo: string, updatedConvocatoria: Partial<Convocatoria>): Observable<any> {
    const params = new HttpParams().set('titulo', titulo);
    return this.http.put(`${this.apiUrl}`, updatedConvocatoria, { params });
  }
}
