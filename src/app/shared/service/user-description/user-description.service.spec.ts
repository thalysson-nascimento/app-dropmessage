/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserDescriptionService } from './user-description.service';

describe('Service: UserDescription', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserDescriptionService]
    });
  });

  it('should ...', inject([UserDescriptionService], (service: UserDescriptionService) => {
    expect(service).toBeTruthy();
  }));
});
