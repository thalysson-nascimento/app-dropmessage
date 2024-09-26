import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostList } from '../../interface/post';

export abstract class PostBase {
  constructor(protected httpClient: HttpClient) {}

  abstract listPost(): Observable<PostList>;
}
