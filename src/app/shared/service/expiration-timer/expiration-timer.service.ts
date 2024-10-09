import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpirationTimerService {
  private behaviorSubjectExpirationTimer$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  constructor() {}

  setExpirationTimer(expirationTimer: string) {
    return this.behaviorSubjectExpirationTimer$.next(expirationTimer);
  }

  getExpirationTimer(): Observable<string> {
    return this.behaviorSubjectExpirationTimer$.asObservable();
  }
}
