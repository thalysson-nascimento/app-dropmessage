/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ListSubscriptionService } from './list-subscription.service';

describe('Service: ListSubscription', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListSubscriptionService]
    });
  });

  it('should ...', inject([ListSubscriptionService], (service: ListSubscriptionService) => {
    expect(service).toBeTruthy();
  }));
});
