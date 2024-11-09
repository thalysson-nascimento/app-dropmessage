/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LikePostMessageService } from './like-post-message.service';

describe('Service: LikePostMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LikePostMessageService]
    });
  });

  it('should ...', inject([LikePostMessageService], (service: LikePostMessageService) => {
    expect(service).toBeTruthy();
  }));
});
