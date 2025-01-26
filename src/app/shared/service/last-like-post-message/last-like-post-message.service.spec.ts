/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LastLikePostMessageService } from './last-like-post-message.service';

describe('Service: LastLikePostMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LastLikePostMessageService]
    });
  });

  it('should ...', inject([LastLikePostMessageService], (service: LastLikePostMessageService) => {
    expect(service).toBeTruthy();
  }));
});
