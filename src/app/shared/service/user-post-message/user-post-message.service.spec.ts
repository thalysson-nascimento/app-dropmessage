/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserPostMessageService } from './user-post-message.service';

describe('Service: UserPostMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserPostMessageService]
    });
  });

  it('should ...', inject([UserPostMessageService], (service: UserPostMessageService) => {
    expect(service).toBeTruthy();
  }));
});
