import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageSecurityRequestService } from '../../service/token-storage-security-request/token-storage-security-request.service';

export const tokenStorageSecurityInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const tokenStorageService = inject(TokenStorageSecurityRequestService);
  const token = tokenStorageService.getToken();

  if (token) {
    console.log('Token existe:', token);
    const authReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  }

  console.log('Token não existe');
  return next(request);
};
