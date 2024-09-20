import { Injectable } from '@angular/core';
import { ApiClass } from '@data/schema/ApiClass.class';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService extends ApiClass {
  constructor(protected override http: HttpClient) {
    super(http);
  }
}
