/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CreateUserCredentialsService } from './create-user-credentials.service';

describe('Service: CreateUserCredentials', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateUserCredentialsService]
    });
  });

  it('should ...', inject([CreateUserCredentialsService], (service: CreateUserCredentialsService) => {
    expect(service).toBeTruthy();
  }));
});
