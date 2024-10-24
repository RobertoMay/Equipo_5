import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IStudentDocDocument } from 'models/istudentdoc.metadata';
import { catchError, map, Observable, of, Subject } from 'rxjs';
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
  ): Observable<{ error: boolean; msg: string; data: any | null }> {
    let params = new HttpParams().set('page', page.toString());
    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<any>(`${this.url}${this.endpoint}/not-enrolled`, { params }).pipe(
      map((response) => ({
        error: false,
        msg: 'Estudiantes no inscritos obtenidos con éxito',
        data: response,
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
