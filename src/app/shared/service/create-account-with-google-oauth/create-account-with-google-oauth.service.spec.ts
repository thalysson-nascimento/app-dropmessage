/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CreateAccountWithGoogleOauthService } from './create-account-with-google-oauth.service';

describe('Service: CreateAccountWithGoogleOauth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateAccountWithGoogleOauthService]
    });
  });

  it('should ...', inject([CreateAccountWithGoogleOauthService], (service: CreateAccountWithGoogleOauthService) => {
    expect(service).toBeTruthy();
  }));
});
