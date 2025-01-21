import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { UserLocation } from '../../interface/user.location.interface';

@Injectable({
  providedIn: 'root',
})
export class UserLocationService {
  constructor(private http: HttpClient) {}

  location({
    state,
    stateCode,
    city,
    continent,
    country,
    countryCode,
    currency,
  }: UserLocation): Observable<UserLocation> {
    return this.http.post<UserLocation>(
      `${currentEnvironment.baseURL}/user-location`,
      { state, stateCode, city, continent, country, countryCode, currency }
    );
  }
}
