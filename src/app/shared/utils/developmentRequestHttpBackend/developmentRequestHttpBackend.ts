import {
  HttpBackend,
  HttpEvent,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export class DevelopmentRequestHttpBackend implements HttpBackend {
  handle(): Observable<HttpEvent<any>> {
    const response = new HttpResponse<any>({
      status: 200,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });

    return of(response).pipe(delay(2000));
  }
}
