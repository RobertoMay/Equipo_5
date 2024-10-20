import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IRegistration } from 'models/iregistration-form.metadata';
import { GenericServiceService } from '@shared/generic.service.service';
import { environment } from '../../../environments/environment.dev'; // Importa el archivo de entorno

@Injectable({
  providedIn: 'root',
})
export class RegistrationService extends GenericServiceService<IRegistration> {
  constructor(protected override http: HttpClient) {
    super(http, 'aspirante');
  }

  addStudent(
    student: IRegistration
  ): Observable<{ error: boolean; msg: string; data: IRegistration | null }> {
    return this.create('aspirante/crearAspirante', student);
  }

  // Método para obtener un aspirante por CURP
  getAspiranteByCurp(curp: string): Observable<{ aspiranteId: string }> {
    return this.http.get<{ aspiranteId: string }>(
      `${environment.uri}aspirante/obtenerAspirantePorCurp/${curp}`
    );
  }

  // Método para actualizar un aspirante
  // Método para actualizar un aspirante
  updateAspirante(
    id: string,
    updatedAspirante: IRegistration // Usamos Partial para permitir actualizaciones parciales
  ): Observable<{
    error: boolean;
    msg: string;
    data: IRegistration | null; // Ajusta según el tipo de respuesta que esperas
  }> {
    return this.http.put<{
      error: boolean;
      msg: string;
      data: IRegistration | null;
    }>(
      `${environment.uri}aspirante/actualizarAspirante/${id}`,
      updatedAspirante
    );
  }
}
