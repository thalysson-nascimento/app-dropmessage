import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

@Injectable({
  providedIn: 'root',
})
export class ReportProblemService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  report(matchId: string, reportProblem: string): Observable<string> {
    return this.httpClient.post<string>(`${this.baseURL}/report-problem`, {
      matchId: matchId,
      reportProblem: reportProblem,
    });
  }
}
