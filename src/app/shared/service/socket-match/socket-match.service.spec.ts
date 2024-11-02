/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { SocketMatchService } from './socket-match.service';

describe('Service: SocketMatch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketMatchService],
    });
  });

  it('should ...', inject(
    [SocketMatchService],
    (service: SocketMatchService) => {
      expect(service).toBeTruthy();
    }
  ));
});
