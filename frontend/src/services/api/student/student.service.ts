import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IStudentDocDocument } from 'models/istudentdoc.metadata';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericServiceService } from '@shared/generic.service.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService extends GenericServiceService<IStudentDocDocument> {

  constructor(protected override http: HttpClient) { 
    super(http, 'studentdoc');
  }

  getNotEnrolledStudents(
    page: number = 1, 
    name?: string
  ): Observable<{ error: boolean; msg: string; data: IStudentDocDocument[] | null }> {
    // Configuramos los parámetros para la consulta
    let params = new HttpParams().set('page', page.toString());
    if (name) {
      params = params.set('name', name);
    }

    // Enviamos la solicitud GET al endpoint correspondiente
    return this.http.get<IStudentDocDocument[]>(`${this.url}${this.endpoint}/not-enrolled`, { params }).pipe(
      map((students) => ({
        error: false,
        msg: 'Estudiantes no inscritos obtenidos con éxito',
        data: students, // El backend devuelve directamente la lista de estudiantes
      })),
      catchError((error) => {
        const errorMessage = 
          error.error?.message || 'Error al obtener estudiantes no inscritos.';
        return of({
          error: true,
          msg: errorMessage,
          data: null,
        });
      })
    );
  }

  getEnrolledStudents(
    page: number = 1, 
    name?: string
  ): Observable<{ error: boolean; msg: string; data: IStudentDocDocument[] | null }> {
    // Configuramos los parámetros para la consulta
    let params = new HttpParams().set('page', page.toString());
    if (name) {
      params = params.set('name', name);
    }

    // Enviamos la solicitud GET al endpoint correspondiente
    return this.http.get<IStudentDocDocument[]>(`${this.url}${this.endpoint}/enrolled`, { params }).pipe(
      map((students) => ({
        error: false,
        msg: 'Estudiantes inscritos obtenidos con éxito',
        data: students, // El backend devuelve directamente la lista de estudiantes
      })),
      catchError((error) => {
        const errorMessage = 
          error.error?.message || 'Error al obtener estudiantes no inscritos.';
        return of({
          error: true,
          msg: errorMessage,
          data: null,
        });
      })
    );
  }
}
