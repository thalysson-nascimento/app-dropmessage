import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { LikePostMessage } from '../../interface/like-post-message.interface';

@Injectable({
  providedIn: 'root',
})
export class UnlikePostMessageService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  unlikePostMessage(postId: string): Observable<LikePostMessage> {
    return this.httpClient.post<LikePostMessage>(
      `${this.baseURL}/unlike-post-message`,
      {
        postMessageId: postId,
      }
    );
  }
}
