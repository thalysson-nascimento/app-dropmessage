/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UnlikePostMessageService } from './unlike-post-message.service';

describe('Service: UnlikePostMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnlikePostMessageService]
    });
  });

  it('should ...', inject([UnlikePostMessageService], (service: UnlikePostMessageService) => {
    expect(service).toBeTruthy();
  }));
});
