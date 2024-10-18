import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  IStudentDocDocument} from 'app/shared/components/registration-process/istudentdoc.metadata';
import { GenericServiceService } from '@shared/generic.service.service';

@Injectable({
  providedIn: 'root'
})
export class StudentdocService extends GenericServiceService< IStudentDocDocument>{

  constructor(protected override http: HttpClient) {
    super(http, 'studentdoc'); // Set the API endpoint to 'calls'
  }

}
