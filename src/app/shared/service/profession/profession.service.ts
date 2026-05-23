import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class ProfessionService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  profession(profession: string): Observable<{ profession: string }> {
    return this.httpClient.post<{ profession: string }>(
      `${this.baseURL}/aboutme/profession`,
      {
        profession: profession,
      }
    );
  }
}
