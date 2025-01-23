/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CancelSubscriptionService } from './cancel-subscription.service';

describe('Service: CancelSubscription', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CancelSubscriptionService]
    });
  });

  it('should ...', inject([CancelSubscriptionService], (service: CancelSubscriptionService) => {
    expect(service).toBeTruthy();
  }));
});
