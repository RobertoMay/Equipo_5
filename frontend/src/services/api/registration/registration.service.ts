import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IRegistration } from '@shared/components/registration-form/iregistration-form.metadata';
import { GenericServiceService } from '@shared/generic.service.service';

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
}
