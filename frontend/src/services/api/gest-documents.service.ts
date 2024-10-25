import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Asegúrate de importar catchError
import { IComments } from 'models/icomments.data'; // Ajusta la ruta según tu estructura
import { IStudentDocDocument } from 'models/istudentdoc.metadata'; // Ajusta la ruta según tu estructura

@Injectable({
  providedIn: 'root'
})
export class GestDocumentsService {
  private baseUrl = 'http://localhost:3000/api/studentdoc'; // Asegúrate de que esta URL sea correcta.

  constructor(private http: HttpClient) {}

  // Método para manejar errores
  private handleError(error: HttpErrorResponse) {
    // Aquí puedes manejar el error, mostrar un mensaje, etc.
    console.error('An error occurred:', error); // Log de error
    return throwError('Something bad happened; please try again later.'); // Mensaje amigable
  }

  // Método para obtener documentos de un aspirante
  getDocumentsByAspiranteId(aspiranteId: string): Observable<IStudentDocDocument[]> {
    return this.http.get<IStudentDocDocument[]>(`${this.baseUrl}/documents/${aspiranteId}`)
      .pipe(catchError(this.handleError)); // Agrega el manejo de errores
  }

  // Método para obtener comentarios de un aspirante
  getCommentsByAspiranteId(aspiranteId: string): Observable<IComments[]> {
    return this.http.get<IComments[]>(`${this.baseUrl}/comments/${aspiranteId}`)
      .pipe(catchError(this.handleError)); // Agrega el manejo de errores
  }

  // Método para agregar un comentario
  addComment(aspiranteId: string, text: string, createdBy: string): Observable<IComments> {
    return this.http.post<IComments>(`${this.baseUrl}/add-comment`, { aspiranteId, text, createdBy })
      .pipe(catchError(this.handleError)); // Agrega el manejo de errores
  }

  // Método para eliminar un comentario
  deleteComment(commentId: string, aspiranteId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete-comment/${commentId}`, { body: { aspiranteId } })
      .pipe(catchError(this.handleError)); // Agrega el manejo de errores
  }

  // Método para actualizar el estado de un documento
  updateDocumentStatus(aspiranteId: string, link: string, status: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/update-status/${aspiranteId}`, { link, status })
      .pipe(catchError(this.handleError)); // Agrega el manejo de errores
  }
  
}
