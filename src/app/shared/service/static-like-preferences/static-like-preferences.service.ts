import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { StaticLikePreferences } from '../../interface/static-like-preferences.interface';

@Injectable({
  providedIn: 'root',
})
export class StaticLikePreferencesService {
  constructor(private httpClient: HttpClient) {}

  staticLikePreferences(): Observable<StaticLikePreferences> {
    return this.httpClient.get<StaticLikePreferences>(
      `${currentEnvironment.baseURL}/static-like-preferences`
    );
  }
}
