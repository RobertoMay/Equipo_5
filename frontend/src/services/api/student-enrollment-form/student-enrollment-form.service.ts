import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IStudentEnrollmentForm } from 'models/istudent-enrollment-form';
import { GenericServiceService } from '@shared/generic.service.service';

@Injectable({
  providedIn: 'root',
})
export class StudentEnrollmentFormService extends GenericServiceService<IStudentEnrollmentForm> {
  constructor(protected override http: HttpClient) {
    super(http, 'datastudents');
  }
}
