/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ExpirationTimerService } from './expiration-timer.service';

describe('Service: ExpirationTimer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpirationTimerService],
    });
  });

  it('should ...', inject(
    [ExpirationTimerService],
    (service: ExpirationTimerService) => {
      expect(service).toBeTruthy();
    }
  ));
});
