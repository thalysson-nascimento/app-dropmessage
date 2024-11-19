/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataConnectChatMessageService } from './data-connect-chat-message.service';

describe('Service: DataConnectChatMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataConnectChatMessageService]
    });
  });

  it('should ...', inject([DataConnectChatMessageService], (service: DataConnectChatMessageService) => {
    expect(service).toBeTruthy();
  }));
});
