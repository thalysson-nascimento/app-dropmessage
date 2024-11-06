import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import {
  CreateAccount,
  CreateAccountSuccess,
} from '../../interface/create-account.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateAccountService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  createAccount(
    dataCreateAccount: CreateAccount
  ): Observable<CreateAccountSuccess> {
    return this.httpClient.post<CreateAccountSuccess>(
      `${this.baseURL}/auth/create-account`,
      dataCreateAccount
    );
  }
}
