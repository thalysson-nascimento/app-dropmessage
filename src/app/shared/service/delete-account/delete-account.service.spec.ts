/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { DeleteAccountService } from './delete-account.service';

describe('Service: DeleteAccount', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeleteAccountService],
    });
  });

  it('should ...', inject(
    [DeleteAccountService],
    (service: DeleteAccountService) => {
      expect(service).toBeTruthy();
    }
  ));
});
