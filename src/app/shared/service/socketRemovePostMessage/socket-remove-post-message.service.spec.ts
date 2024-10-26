/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SocketRemovePostMessageService } from './socket-remove-post-message.service';

describe('Service: SocketRemovePostMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketRemovePostMessageService]
    });
  });

  it('should ...', inject([SocketRemovePostMessageService], (service: SocketRemovePostMessageService) => {
    expect(service).toBeTruthy();
  }));
});
