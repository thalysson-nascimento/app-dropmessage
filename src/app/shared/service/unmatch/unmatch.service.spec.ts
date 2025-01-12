/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UnmatchService } from './unmatch.service';

describe('Service: Unmatch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnmatchService]
    });
  });

  it('should ...', inject([UnmatchService], (service: UnmatchService) => {
    expect(service).toBeTruthy();
  }));
});
