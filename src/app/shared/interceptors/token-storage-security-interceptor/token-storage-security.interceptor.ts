import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TokenStorageSecurityRequestService } from '../../service/token-storage-security-request/token-storage-security-request.service';

export const tokenStorageSecurityInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const tokenStorageService = inject(TokenStorageSecurityRequestService);

  return tokenStorageService.getToken().pipe(
    switchMap((token) => {
      if (token) {
        const authReq = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`),
        });
        return next(authReq);
      } else {
        console.log('Token não existe');
        return next(request);
      }
    })
  );
};
