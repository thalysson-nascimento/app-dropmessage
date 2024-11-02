/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { MatchDataDetailsService } from './match-data-details.service';

describe('Service: MatchDetails', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchDataDetailsService],
    });
  });

  it('should ...', inject(
    [MatchDataDetailsService],
    (service: MatchDataDetailsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
