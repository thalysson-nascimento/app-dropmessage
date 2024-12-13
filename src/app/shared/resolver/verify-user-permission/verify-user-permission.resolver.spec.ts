/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { VerifyUserPermissionResolver } from './verify-user-permission.resolver';

describe('Service: VerifyUserPermission', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerifyUserPermissionResolver],
    });
  });

  it('should ...', inject(
    [VerifyUserPermissionResolver],
    (service: VerifyUserPermissionResolver) => {
      expect(service).toBeTruthy();
    }
  ));
});
