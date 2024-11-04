import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData } from '../../interface/user-data.interface';

@Injectable({
  providedIn: 'root',
})
export class UserDataCacheService {
  private behaviorSubjectUserDataCache$: BehaviorSubject<UserData | null> =
    new BehaviorSubject<UserData | null>(null);

  constructor() {}

  setUserDataCache(userData: UserData | null) {
    this.behaviorSubjectUserDataCache$.next(userData);
  }

  getUserDataCache(): Observable<UserData | null> {
    return this.behaviorSubjectUserDataCache$.asObservable();
  }
}
