import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GenericServiceService } from '@shared/generic.service.service';

@Injectable({
  providedIn: 'root',
})
export class HojasInscripcionService extends GenericServiceService<any> {
  constructor(protected override http: HttpClient) {
    super(http, 'hojas-inscripcion'); // Define el endpoint base
  }

  generateAndUploadPdf(
    aspirantId: string,
    data: any
  ): Observable<{ message: string }> {
    return this.create(`hojas-inscripcion/${aspirantId}`, data).pipe(
      map(response => ({
        message: response.msg, // Ajustar según tu estructura de respuesta actual
      }))
    );
  }
}
