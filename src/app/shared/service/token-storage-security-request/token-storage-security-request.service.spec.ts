/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TokenStorageSecurityRequestService } from './token-storage-security-request.service';

describe('Service: TokenStorageSecurityRequest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenStorageSecurityRequestService]
    });
  });

  it('should ...', inject([TokenStorageSecurityRequestService], (service: TokenStorageSecurityRequestService) => {
    expect(service).toBeTruthy();
  }));
});
