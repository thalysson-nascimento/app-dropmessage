/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GoogleAuthService } from './google-auth.service';

describe('Service: GoogleAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleAuthService]
    });
  });

  it('should ...', inject([GoogleAuthService], (service: GoogleAuthService) => {
    expect(service).toBeTruthy();
  }));
});
