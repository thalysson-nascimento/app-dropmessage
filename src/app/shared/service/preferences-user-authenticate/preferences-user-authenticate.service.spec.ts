/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PreferencesUserAuthenticateService } from './preferences-user-authenticate.service';

describe('Service: PreferencesUserAuthenticate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreferencesUserAuthenticateService]
    });
  });

  it('should ...', inject([PreferencesUserAuthenticateService], (service: PreferencesUserAuthenticateService) => {
    expect(service).toBeTruthy();
  }));
});
