import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IConvocatoria} from '@shared/components/calls/icalls.metadata';
import { GenericServiceService } from '@shared/generic.service.service';

@Injectable({
  providedIn: 'root',
})
export class CallService extends GenericServiceService<IConvocatoria> {
  constructor(protected override http: HttpClient) {
    super(http, 'calls'); // Set the API endpoint to 'calls'
  }

  addAnnouncement(
    newConvocatoria: IConvocatoria
  ): Observable<{ error: boolean; msg: string; data: IConvocatoria | null }> {
    return this.create('calls/create', newConvocatoria);
  }

  updateAnnouncement(
    id: number,
    updatedConvocatoria: IConvocatoria
  ): Observable<IConvocatoria> {
    return this.update(id, updatedConvocatoria);
  }
}
