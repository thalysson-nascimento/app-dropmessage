import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class UnmatchService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  report(matchId: string): Observable<string> {
    return this.httpClient.post<string>(`${this.baseURL}/unmatch`, {
      matchId: matchId,
    });
  }
}
