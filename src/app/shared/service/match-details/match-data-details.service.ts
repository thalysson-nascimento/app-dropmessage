import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatchDetails } from '../../interface/match-details.interface';

@Injectable({
  providedIn: 'root',
})
export class MatchDataDetailsService {
  private matchedDetails$: BehaviorSubject<MatchDetails[]> =
    new BehaviorSubject<MatchDetails[]>([]);

  constructor() {}

  setMatchedDetails(matches: MatchDetails[]): void {
    this.matchedDetails$.next(matches);
  }

  getMatchedDetails(): Observable<MatchDetails[]> {
    return this.matchedDetails$.asObservable();
  }
}
