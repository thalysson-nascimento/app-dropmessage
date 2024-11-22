/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { SocketSenMessageService } from './socket-sen-message.service';

describe('Service: SocketSenMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketSenMessageService],
    });
  });

  it('should ...', inject(
    [SocketSenMessageService],
    (service: SocketSenMessageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
