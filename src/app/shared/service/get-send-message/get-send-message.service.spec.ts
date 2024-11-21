/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GetSendMessageService } from './get-send-message.service';

describe('Service: GetSendMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetSendMessageService]
    });
  });

  it('should ...', inject([GetSendMessageService], (service: GetSendMessageService) => {
    expect(service).toBeTruthy();
  }));
});
