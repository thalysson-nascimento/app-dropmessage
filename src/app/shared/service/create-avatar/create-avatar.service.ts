import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { Avatar, AvatarSuccess } from '../../interface/avatar.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateAvatarService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  avatar({
    file,
    dateOfBirth,
    gender,
    interests,
  }: Avatar): Observable<AvatarSuccess> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('gender', gender);
    formData.append('interests', interests);

    return this.httpClient
      .post<AvatarSuccess>(`${this.baseURL}/avatar-and-about`, formData)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(() => errorResponse);
        })
      );
  }
}
