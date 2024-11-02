/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { LoginService } from './sign.service';

describe('Service: Sign', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginService],
    });
  });

  it('should ...', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));
});
