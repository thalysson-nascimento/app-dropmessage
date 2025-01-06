/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { CodeConfirmationService } from './code-confirmation-email.service';

describe('Service: CodeConfirmation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CodeConfirmationService],
    });
  });

  it('should ...', inject(
    [CodeConfirmationService],
    (service: CodeConfirmationService) => {
      expect(service).toBeTruthy();
    }
  ));
});
