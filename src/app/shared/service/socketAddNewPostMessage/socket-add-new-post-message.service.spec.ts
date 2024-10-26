/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { SocketAddNewPostMessageService } from './socket-add-new-post-message.service';

describe('Service: SocketAddNewPostMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketAddNewPostMessageService],
    });
  });

  it('should ...', inject(
    [SocketAddNewPostMessageService],
    (service: SocketAddNewPostMessageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
