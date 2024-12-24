/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { GenerateTipsService } from './tips.service';

describe('Service: Tips', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenerateTipsService],
    });
  });

  it('should ...', inject(
    [GenerateTipsService],
    (service: GenerateTipsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
