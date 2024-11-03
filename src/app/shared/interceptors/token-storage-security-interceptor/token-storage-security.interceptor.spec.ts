/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { TokenStorageSecurityInterceptor } from './token-storage-security.interceptor';

describe('Service: TokenStorageSecurity', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenStorageSecurityInterceptor],
    });
  });

  it('should ...', inject(
    [TokenStorageSecurityInterceptor],
    (service: TokenStorageSecurityInterceptor) => {
      expect(service).toBeTruthy();
    }
  ));
});
