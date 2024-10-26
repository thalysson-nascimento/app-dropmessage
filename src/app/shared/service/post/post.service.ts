import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { PostList } from '../../interface/post';
import { PostBase } from './post.base';

@Injectable({
  providedIn: 'root',
})
export class PostMessageService extends PostBase {
  private baseURL = currentEnvironment.baseURL;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  listPost(page: number = 1, limit: number = 10): Observable<PostList> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.httpClient
      .get<PostList>(`${this.baseURL}/post-message`, { params })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(() => errorResponse);
        })
      );
  }
}
