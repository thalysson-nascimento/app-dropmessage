/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CacheAvatarService } from './cache-avatar.service';

describe('Service: CacheAvatar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CacheAvatarService]
    });
  });

  it('should ...', inject([CacheAvatarService], (service: CacheAvatarService) => {
    expect(service).toBeTruthy();
  }));
});
