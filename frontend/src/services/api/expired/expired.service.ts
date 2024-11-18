import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IExpired } from 'models/iexpired.data';
import { GenericServiceService } from '@shared/generic.service.service';

@Injectable({
  providedIn: 'root',
})
export class ExpiredService extends GenericServiceService<IExpired> {
  constructor(protected override http: HttpClient) {
    super(http, 'expired-students');
  }
}
