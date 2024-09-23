import { Injectable } from '@angular/core';
import { ApiClass } from '@data/schema/ApiClass.class';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IRegistration } from '@shared/components/registration-form/iregistration-form.metadata';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService extends ApiClass {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  addStudent(studet: IRegistration): Observable<{
    error: boolean;
    msg: string;
    data: IRegistration | null;
  }> {
    const response = {
      error: false,
      msg: '',
      data: null as IRegistration | null,
    };
    return this.http
      .post<IRegistration>(this.url + 'crearAspirante', studet)
      .pipe(
        map((r) => {
          response.data = r;
          return response;
        }),
        catchError(this.error)
      );
  }
}
