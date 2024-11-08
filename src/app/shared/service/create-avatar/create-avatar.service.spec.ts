/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CreateAvatarService } from './create-avatar.service';

describe('Service: CreateAvatar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateAvatarService]
    });
  });

  it('should ...', inject([CreateAvatarService], (service: CreateAvatarService) => {
    expect(service).toBeTruthy();
  }));
});
