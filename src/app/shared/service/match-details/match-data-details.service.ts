import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatchUsers } from '../../interface/match-users.interface';

@Injectable({
  providedIn: 'root',
})
export class MatchDataDetailsService {
  private matchedDetails$: BehaviorSubject<MatchUsers[]> = new BehaviorSubject<
    MatchUsers[]
  >([]);

  constructor() {}

  setMatchedDetails(matches: MatchUsers[]): void {
    this.matchedDetails$.next(matches);
  }

  getMatchedDetails(): Observable<MatchUsers[]> {
    return this.matchedDetails$.asObservable();
  }
}
