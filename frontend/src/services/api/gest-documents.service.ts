import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Asegúrate de importar catchError
import { IGestComment } from 'models/igest-comments.data';
import { IGestStudentDocument } from 'models/igest-student-doc.metadata';
import { GenericServiceService } from '@shared/generic.service.service';

@Injectable({
  providedIn: 'root'
})
export class GestDocumentsService extends GenericServiceService<IGestStudentDocument> {

  constructor(protected override http: HttpClient) {  
    super(http, 'studentdoc');
  }


  // 1. Obtener documentos del aspirante
  getDocumentsByAspiranteId(aspiranteId: string): Observable<IGestStudentDocument[]> {
    return this.http.get<IGestStudentDocument[]>(`${this.url}${this.endpoint}/documents/${aspiranteId}`)
      .pipe(catchError(this.handleError));
  }

  // 2. Actualizar estado del documento
  updateDocumentStatus(aspiranteId: string, link: string, status: 'approved' | 'rejected'): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.url}${this.endpoint}/update-status/${aspiranteId}`, { link, status })
      .pipe(catchError(this.handleError));
  }

  // 3. Obtener comentarios de un aspirante
  getCommentsByAspiranteId(aspiranteId: string): Observable<IGestComment[]> {
    return this.http.get<IGestComment[]>(`${this.url}${this.endpoint}/comments/${aspiranteId}`)
      .pipe(catchError(this.handleError));
  }

  // 4. Agregar comentario a un aspirante
  addCommentToAspirante(aspiranteId: string, text: string, createdBy: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.url}${this.endpoint}/add-comment`, { aspiranteId, text, createdBy })
      .pipe(catchError(this.handleError));
  }

  // 5. Eliminar un comentario de un aspirante
  deleteComment(commentId: string, aspiranteId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}${this.endpoint}/delete-comment/${commentId}`, { body: { aspiranteId } })
      .pipe(catchError(this.handleError));
  }

  // Método de manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Error código: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  
}
