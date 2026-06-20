import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { UserPostMessage, DeletePostResponse, UpdatePostResponse } from '../../interface/user-post-message.interface';

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

  deletePost(id: string): Observable<DeletePostResponse> {
    return this.httpCliente
      .delete<DeletePostResponse>(`${this.baseURL}/user-post-message/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  updatePostExpiration(id: string, expirationTimer: string): Observable<UpdatePostResponse> {
    return this.httpCliente
      .patch<UpdatePostResponse>(`${this.baseURL}/user-post-message/${id}`, { expirationTimer })
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }
}
