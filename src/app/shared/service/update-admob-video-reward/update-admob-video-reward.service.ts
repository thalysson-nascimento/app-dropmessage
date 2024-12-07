import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';

interface UpdateAdmobVideoReward {
  updatedAt: string;
  mustWatchVideoReword: boolean;
  totalLikes: number;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateAdmobVideoRewardService {
  private baseURL = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  updateVideoReward(): Observable<UpdateAdmobVideoReward> {
    return this.httpClient
      .get<UpdateAdmobVideoReward>(`${this.baseURL}/update-admob-video-reward`)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }
}
