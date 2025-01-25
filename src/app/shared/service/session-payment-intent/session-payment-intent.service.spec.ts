/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SessionPaymentIntentService } from './session-payment-intent.service';

describe('Service: SessionPaymentIntent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionPaymentIntentService]
    });
  });

  it('should ...', inject([SessionPaymentIntentService], (service: SessionPaymentIntentService) => {
    expect(service).toBeTruthy();
  }));
});
