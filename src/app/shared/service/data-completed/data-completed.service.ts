import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { DataCompletedBase } from './data-completed.base';

interface DataCompleted {
  file: Blob;
  dateOfBirth: string;
  gender: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataCompletedService extends DataCompletedBase {
  baseURL: string = currentEnvironment.baseURL;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  override dataCompleted({
    file,
    dateOfBirth,
    gender,
  }: DataCompleted): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('gender', gender);

    return this.httpClient
      .post<any>(`${this.baseURL}/data-completed`, formData)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(() => errorResponse);
        })
      );
  }
}
