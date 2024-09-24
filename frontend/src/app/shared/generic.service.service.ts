import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiClass } from '@data/schema/ApiClass.class';
import { IBaseModel } from './base-model';

@Injectable({
  providedIn: 'root',
})
export class GenericServiceService<T extends IBaseModel> extends ApiClass {
  constructor(
    protected override http: HttpClient,
    @Inject(String) private endpoint: string
  ) {
    super(http);
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.url}${this.endpoint}`).pipe(
      map((data: T[]) => data),
      catchError((error) => {
        console.error('Error fetching data:', error);
        return throwError(
          () => new Error(error.message || 'Error del servidor')
        );
      })
    );
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}${this.endpoint}/${id}`).pipe(
      map((data: T) => data),
      catchError((error) => {
        console.error('Error fetching data:', error);
        return throwError(
          () => new Error(error.message || 'Error del servidor')
        );
      })
    );
  }

  create(
    endpoint: string,
    item: T
  ): Observable<{ error: boolean; msg: string; data: T | null }> {
    return this.http.post<T>(`${this.url}${endpoint}`, item).pipe(
      map((r) => ({
        error: false,
        msg: '',
        data: r,
      })),
      catchError((error) => {
        const errorMessage =
          error.error.details || 'Error al crear el elemento.';
        return of({
          error: true,
          msg: errorMessage,
          data: null,
        });
      })
    );
  }

  update(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.url}${this.endpoint}/${id}`, item).pipe(
      map((data: T) => data),
      catchError((error) => {
        console.error('Error updating data:', error);
        return throwError(
          () => new Error(error.message || 'Error del servidor')
        );
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${this.endpoint}/${id}`).pipe(
      map(() => {}),
      catchError((error) => {
        console.error('Error deleting data:', error);
        return throwError(
          () => new Error(error.message || 'Error del servidor')
        );
      })
    );
  }
}
