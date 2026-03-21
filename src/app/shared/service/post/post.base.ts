import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../../interface/post.interface';

export abstract class PostBase {
  constructor(protected httpClient: HttpClient) {}

  abstract listPost(): Observable<Post>;
}
