import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { LastLoggedUsers } from '../../interface/last-logged-users.interface';

@Injectable({
  providedIn: 'root',
})
export class LastLoggedUsersService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  lastLoggedUsers(): Observable<LastLoggedUsers> {
    return this.httpClient.get<LastLoggedUsers>(
      `${this.baseURL}/last-logged-users`
    );
  }
}
