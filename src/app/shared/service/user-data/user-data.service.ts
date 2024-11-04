import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { UserData } from '../../interface/user-data.interface';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  userData(): Observable<UserData> {
    return this.httpClient.get<UserData>(`${this.baseURL}/user`);
  }
}
