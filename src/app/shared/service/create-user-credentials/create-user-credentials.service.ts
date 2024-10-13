import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class CreateUserCredentialsService {
  constructor(private httpClient: HttpClient) {}

  userCredentials(): Observable<any> {
    const baseURL = currentEnvironment.baseURL;
    return this.httpClient.post(`${baseURL}/user-credentials`, {
      name: 'Thalysson',
      email: 'ta@aaasalak.camaom',
      password: '123456',
    });
  }
}
