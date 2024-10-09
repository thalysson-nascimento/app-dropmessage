import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedPostMessage } from '../../interface/shared-post-message.interface';

interface DataPostMessage {
  file: Blob;
  expirationTimer: string;
}

export abstract class SharedPostMessageBase {
  constructor(protected httpClient: HttpClient) {}

  abstract postMessage({
    file,
    expirationTimer,
  }: DataPostMessage): Observable<SharedPostMessage>;
}
