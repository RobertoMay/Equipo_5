import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IConvocatorias } from '@modules/home-admin/iconvocatorias.metadata';
import { GenericServiceService } from '@shared/generic.service.service';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService extends GenericServiceService<IConvocatorias> {
  constructor(protected override http: HttpClient) {
    super(http, 'enrollment-period');
  }

  getAllEnrollment(): Observable<{
    error: boolean;
    msg: string;
    data: IConvocatorias[] | null;
  }> {
    return this.getAll();
  }
}
