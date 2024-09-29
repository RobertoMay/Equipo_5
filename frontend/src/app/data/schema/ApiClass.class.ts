import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environmet';
import { of } from 'rxjs';

export class ApiClass {
  public url = environment.apiUrl;
  public isProduction = environment.production;

  constructor(protected http: HttpClient) {}

  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error code: ${error.status}\nMessage: ${error.message}`;
    }
    return of({ error: true, msg: errorMessage, data: null });
  }
}
