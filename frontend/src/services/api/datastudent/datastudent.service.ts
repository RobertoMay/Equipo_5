import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IDataStudent } from '../../../app/modules/student-portal/idata_student.metadata';
import { GenericServiceService } from '@shared/generic.service.service';
import { environment } from '../../../environments/environment.dev'; // Importa el archivo de entorno
@Injectable({
  providedIn: 'root'
})
export class DataStudentService extends GenericServiceService<IDataStudent> {
  constructor(protected override http: HttpClient) {
    super(http, 'datastudents'); // Set the API endpoint to 'calls'
  }
 

// Método para obtener un estudiante por su aspiranteId
getByAspiranteId(aspiranteId: string): Observable<IDataStudent | null> {
  return this.http.get<IDataStudent | null>(
    `${environment.uri}datastudents/aspirante/${aspiranteId}`
  );
}
}