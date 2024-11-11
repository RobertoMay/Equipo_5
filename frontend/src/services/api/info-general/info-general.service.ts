import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IInfoGeneral } from 'models/iinfo-general.metadata';
import { GenericServiceService } from '@shared/generic.service.service';

@Injectable({
  providedIn: 'root',
})
export class InfoGeneralService extends GenericServiceService<IInfoGeneral> {
  constructor(protected override http: HttpClient) {
    super(http, 'about');
  }
}
