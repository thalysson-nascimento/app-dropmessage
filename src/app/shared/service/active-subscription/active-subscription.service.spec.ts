/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ActiveSubscriptionService } from './active-subscription.service';

describe('Service: ActiveSubscription', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveSubscriptionService]
    });
  });

  it('should ...', inject([ActiveSubscriptionService], (service: ActiveSubscriptionService) => {
    expect(service).toBeTruthy();
  }));
});
