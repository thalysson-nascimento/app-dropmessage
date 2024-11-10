import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { LikePostMessage } from '../../interface/like-post-message.interface';

@Injectable({
  providedIn: 'root',
})
export class LikePostMessageService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  likePostMessage(postId: string): Observable<LikePostMessage> {
    console.log('====>', postId);
    return this.httpClient.post<LikePostMessage>(
      `${this.baseURL}/like-post-message`,
      {
        postId: postId,
      }
    );
  }
}
