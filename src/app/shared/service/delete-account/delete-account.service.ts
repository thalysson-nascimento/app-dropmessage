import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { DeleteAccountSuccess } from '../../interface/delete-account.interface';

@Injectable({
  providedIn: 'root',
})
export class DeleteAccountService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  deleteAccount(): Observable<DeleteAccountSuccess> {
    return this.httpClient.post<DeleteAccountSuccess>(
      `${this.baseURL}/delete-account`,
      {}
    );
  }
}
