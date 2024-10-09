/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { SharedPostMessageService } from './shared-post-message.service';

describe('Service: SharedPostMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedPostMessageService],
    });
  });

  it('should ...', inject(
    [SharedPostMessageService],
    (service: SharedPostMessageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
