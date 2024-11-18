/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ListChatService } from './list-chat.service';

describe('Service: ListChat', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListChatService]
    });
  });

  it('should ...', inject([ListChatService], (service: ListChatService) => {
    expect(service).toBeTruthy();
  }));
});
