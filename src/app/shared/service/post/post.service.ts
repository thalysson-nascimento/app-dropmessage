import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { PostList } from '../../interface/post';
import { PostBase } from './post.base';

@Injectable({
  providedIn: 'root',
})
export class PostService extends PostBase {
  private baseURL = currentEnvironment.baseURL;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  listPost(): Observable<PostList> {
    return this.httpClient.get<PostList>(`${this.baseURL}/post-message`).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        return throwError(() => errorResponse);
      })
    );
  }
}
