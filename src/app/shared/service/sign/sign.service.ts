import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { Sign } from '../../interface/sign.interface';
import { TokenResponseSuccess } from '../../interface/token-response-success.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseURL = currentEnvironment.baseURL;
  constructor(private httpClient: HttpClient) {}

  login(sign: Sign): Observable<TokenResponseSuccess> {
    return this.httpClient.post<TokenResponseSuccess>(
      `${this.baseURL}/auth/user-credentials`,
      sign
    );
  }
}
