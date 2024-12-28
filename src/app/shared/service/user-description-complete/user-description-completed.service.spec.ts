/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserDescriptionCompletedService } from './user-description-completed.service';

describe('Service: UserDescriptionCompleted', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserDescriptionCompletedService]
    });
  });

  it('should ...', inject([UserDescriptionCompletedService], (service: UserDescriptionCompletedService) => {
    expect(service).toBeTruthy();
  }));
});
