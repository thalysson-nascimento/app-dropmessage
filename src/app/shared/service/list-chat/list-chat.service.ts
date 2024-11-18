import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { ListChat } from '../../interface/list-chat.interface';

@Injectable({
  providedIn: 'root',
})
export class ListChatService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpCLient: HttpClient) {}

  listChat(): Observable<ListChat[]> {
    return this.httpCLient.get<ListChat[]>(`${this.baseURL}/list-chat`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
