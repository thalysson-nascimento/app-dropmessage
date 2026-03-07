/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UpdateAvatarService } from './update-avatar.service';

describe('Service: UpdateAvatar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateAvatarService]
    });
  });

  it('should ...', inject([UpdateAvatarService], (service: UpdateAvatarService) => {
    expect(service).toBeTruthy();
  }));
});
