import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { currentEnvironment } from '../../../../environment.config';
import { MyProfile } from '../../interface/my-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class MyProfileService {
  baseURL: string = currentEnvironment.baseURL;

  constructor(private httpClient: HttpClient) {}

  myProfile(): Observable<MyProfile> {
    return this.httpClient.get<MyProfile>(`${this.baseURL}/my-profile`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
