/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserDataCacheService } from './user-data-cache.service';

describe('Service: UserDataCache', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserDataCacheService]
    });
  });

  it('should ...', inject([UserDataCacheService], (service: UserDataCacheService) => {
    expect(service).toBeTruthy();
  }));
});
