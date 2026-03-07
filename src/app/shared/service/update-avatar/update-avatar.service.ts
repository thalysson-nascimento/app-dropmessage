import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { currentEnvironment } from '../../../../environment.config';

interface UpdateAvatar {
  message: string;
  avatarUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateAvatarService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  update(file: Blob): Observable<UpdateAvatar> {
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient
      .patch<UpdateAvatar>(`${this.baseURL}/update-avatar`, formData)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(() => errorResponse);
        })
      );
  }
}
