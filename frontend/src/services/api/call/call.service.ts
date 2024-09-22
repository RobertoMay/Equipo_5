import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Convocatoria } from '../../../app/modules/models'; // Asegúrate de que esta ruta sea correcta
import { environment } from '../../../environments/environmet';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  private myAppUrl: string;
  private apiUrl : string;  // URL de la API base

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.apiUrl;
    this.apiUrl = 'calls'
  }

  createNewAnnouncement(newwConvocatoria: Convocatoria): Observable<any> {
    console.log('Calling the service to create a new announcement'); // Add this log
    return this.http.post(`${this.myAppUrl}${this.apiUrl}/create`, newwConvocatoria);
  }

  // Método para obtener todas las convocatorias
  getConvocatorias(): Observable<Convocatoria[]> {
    console.log('Llamada al servicio para obtener convocatorias'); // Agrega este log
    return this.http.get<Convocatoria[]>(`${this.myAppUrl}${this.apiUrl}/getallcalls`);
  }


  // Método para obtener una convocatoria por título
  getConvocatoriaByTitle(title: string): Observable<Convocatoria> {
    return this.http.get<Convocatoria>(`${this.myAppUrl}${this.apiUrl}/getcall/${title}`);
  }

  // Método para eliminar convocatorias por título
  deleteConvocatoriaByTitle(title: string): Observable<any> {
    return this.http.delete(`${this.myAppUrl}${this.apiUrl}/deletecall/${title}`);
  }

  updateConvocatoriaByTitle(title: string, updatedConvocatoria: Partial<Convocatoria>): Observable<any> {
    return this.http.put(`${this.myAppUrl}${this.apiUrl}/updatecalls/${title}`, updatedConvocatoria);
  }
}
