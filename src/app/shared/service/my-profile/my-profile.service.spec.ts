/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyProfileService } from './my-profile.service';

describe('Service: MyProfile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyProfileService]
    });
  });

  it('should ...', inject([MyProfileService], (service: MyProfileService) => {
    expect(service).toBeTruthy();
  }));
});
