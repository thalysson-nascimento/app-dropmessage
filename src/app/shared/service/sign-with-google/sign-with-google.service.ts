import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { TokenResponseSuccess } from '../../interface/token-response-success.interface';
import { CreateAccountWithGoogleOAuth } from '../../interface/create-account.interface';

@Injectable({
  providedIn: 'root',
})
export class SignWithGoogleService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  sign(userData: CreateAccountWithGoogleOAuth): Observable<TokenResponseSuccess> {
    return this.httpClient.post<TokenResponseSuccess>(
      `${this.baseURL}/auth/create-account-with-google`,
       userData 
    );
  }
}
