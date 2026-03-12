/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AiProfilesService } from './ai-profiles.service';

describe('Service: AiProfiles', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AiProfilesService]
    });
  });

  it('should ...', inject([AiProfilesService], (service: AiProfilesService) => {
    expect(service).toBeTruthy();
  }));
});
