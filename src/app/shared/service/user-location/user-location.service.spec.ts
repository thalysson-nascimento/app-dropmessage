/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserLocationService } from './user-location.service';

describe('Service: UserLocation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserLocationService]
    });
  });

  it('should ...', inject([UserLocationService], (service: UserLocationService) => {
    expect(service).toBeTruthy();
  }));
});
