import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IStudentDocDocument } from 'models/istudentdoc.metadata';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericServiceService } from '@shared/generic.service.service';

@Injectable({
  providedIn: 'root',
})
export class StudentdocService extends GenericServiceService<IStudentDocDocument> {
  constructor(protected override http: HttpClient) {
    super(http, 'studentdoc');
  }

  uploadFile(
    aspiranteId: string,
    file: File,
    documentType: string,
    documentName: string
  ): Observable<{ error: boolean; msg: string; data: any | null }> {
    const formData = new FormData();
    formData.append('aspiranteId', aspiranteId);
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('documentName', documentName);

    return this.http
      .post<any>(`${this.url}${this.endpoint}/add-document`, formData)
      .pipe(
        map((response) => ({
          error: false,
          msg: 'Archivo subido con éxito',
          data: response,
        })),
        catchError((error) => {
          const errorMessage =
            error.error.details || 'Error al subir el archivo.';
          return of({
            error: true,
            msg: errorMessage,
            data: null,
          });
        })
      );
  }

   // Método para obtener los estudiantes inscritos con paginación y filtro opcional por nombre
   getEnrolledStudents(page: number = 1, name?: string): Observable<{ error: boolean; msg: string; data: any | null }> {
    let params = new HttpParams().set('page', page.toString());
    if (name) {
      params = params.set('name', name);
    }

    return this.http
      .get<any>(`${this.url}${this.endpoint}/enrolled`, { params })
      .pipe(
        map((response) => ({
          error: false,
          msg: 'Estudiantes obtenidos con éxito',
          data: response,
        })),
        catchError((error) => {
          const errorMessage =
            error.error.details || 'Error al obtener los estudiantes.';
          return of({
            error: true,
            msg: errorMessage,
            data: null,
          });
        })
      );
  }
}
