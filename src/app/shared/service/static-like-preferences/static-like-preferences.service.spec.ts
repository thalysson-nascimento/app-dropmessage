/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { StaticLikePreferencesService } from './static-like-preferences.service';

describe('Service: StaticLikePreferences', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaticLikePreferencesService],
    });
  });

  it('should ...', inject(
    [StaticLikePreferencesService],
    (service: StaticLikePreferencesService) => {
      expect(service).toBeTruthy();
    }
  ));
});
