/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SignWithGoogleService } from './sign-with-google.service';

describe('Service: SignWithGoogle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignWithGoogleService]
    });
  });

  it('should ...', inject([SignWithGoogleService], (service: SignWithGoogleService) => {
    expect(service).toBeTruthy();
  }));
});
