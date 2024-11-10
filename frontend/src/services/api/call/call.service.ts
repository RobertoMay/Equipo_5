import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs'; // Importa 'of' desde 'rxjs'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IConvocatoria, IConvocatoriaResponse } from 'models/icalls.metadata';
import { GenericServiceService } from '@shared/generic.service.service';
import { map, catchError } from 'rxjs/operators'; // Importa 'map' y 'catchError' desde 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class CallService extends GenericServiceService<IConvocatoria> {
  constructor(protected override http: HttpClient) {
    
    super(http, 'calls'); // Set the API endpoint to 'calls'
  }
  private callCreatedSource = new Subject<void>();
  callCreated$ = this.callCreatedSource.asObservable();
  
  addAnnouncement(
    newConvocatoria: IConvocatoria
  ): Observable<{ error: boolean; msg: string; data: IConvocatoria | null }> {
    return this.http.post<IConvocatoriaResponse>(`${this.url}${this.endpoint}/create`, newConvocatoria).pipe(
      map(response => ({
        error: false,
        msg: 'Convocatoria creada exitosamente',
        data: response.convocatoria
      })),
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.details || error.error?.message || 'Error al crear la convocatoria';
        return of({
          error: true,
          msg: errorMsg,
          data: null
        });
      })
    );
  }
  
  updateAnnouncement(
    id: string,
    updatedConvocatoria: IConvocatoria
  ): Observable<{
    error: boolean;
    msg: string;
    data: IConvocatoria | null;
  }> {
    return this.update(id, updatedConvocatoria);
  }

  getCurrentAnnouncement(): Observable<IConvocatoria> {
    return this.http.get<IConvocatoria>(`${this.url}${this.endpoint}/status/`); // Adjust the URL as necessary
  }

  // Método para obtener todas las convocatorias
  getAllAnnouncements(): Observable<{ message: string; convocatorias: IConvocatoria[] }> {
    return this.http.get<{ message: string; convocatorias: IConvocatoria[] }>(`${this.url}${this.endpoint}/all`);
  }

  notifyCallCreated() {
    this.callCreatedSource.next();
  }
}
