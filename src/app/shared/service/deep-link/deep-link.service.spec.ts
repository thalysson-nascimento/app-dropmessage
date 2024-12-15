/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeepLinkService } from './deep-link.service';

describe('Service: DeepLink', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeepLinkService]
    });
  });

  it('should ...', inject([DeepLinkService], (service: DeepLinkService) => {
    expect(service).toBeTruthy();
  }));
});
