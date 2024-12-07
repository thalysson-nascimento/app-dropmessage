/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdMobService } from './ad-mob.service';

describe('Service: AdMob', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdMobService]
    });
  });

  it('should ...', inject([AdMobService], (service: AdMobService) => {
    expect(service).toBeTruthy();
  }));
});
