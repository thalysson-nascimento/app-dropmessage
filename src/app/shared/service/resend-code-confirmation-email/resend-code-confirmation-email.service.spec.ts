/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ResendCodeConfirmationEmailService } from './resend-code-confirmation-email.service';

describe('Service: ResendCodeConfirmationEmail', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResendCodeConfirmationEmailService]
    });
  });

  it('should ...', inject([ResendCodeConfirmationEmailService], (service: ResendCodeConfirmationEmailService) => {
    expect(service).toBeTruthy();
  }));
});
