import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { UserDataInterface } from '../../interface/user-data-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  userData(): Observable<UserDataInterface> {
    return this.httpClient.get<UserDataInterface>(`${this.baseURL}/user`);
  }
}
