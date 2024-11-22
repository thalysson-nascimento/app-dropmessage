/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserHashPublicService } from './user-hash-public.service';

describe('Service: UserHashPublic', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserHashPublicService]
    });
  });

  it('should ...', inject([UserHashPublicService], (service: UserHashPublicService) => {
    expect(service).toBeTruthy();
  }));
});
