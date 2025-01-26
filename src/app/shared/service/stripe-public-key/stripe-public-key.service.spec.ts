/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StripePublicKeyService } from './stripe-public-key.service';

describe('Service: StripePublicKey', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StripePublicKeyService]
    });
  });

  it('should ...', inject([StripePublicKeyService], (service: StripePublicKeyService) => {
    expect(service).toBeTruthy();
  }));
});
