import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { UserPostMessage } from '../../interface/user-post-message.interface';

@Injectable({
  providedIn: 'root',
})
export class UserPostMessageService {
  private baseURL = currentEnvironment.baseURL;
  constructor(private httpCliente: HttpClient) {}

  userPostMessage(): Observable<UserPostMessage> {
    return this.httpCliente
      .get<UserPostMessage>(`${this.baseURL}/user-post-message`)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }
}
