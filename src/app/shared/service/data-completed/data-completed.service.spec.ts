/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { DataCompletedService } from './data-completed.service';

describe('Service: DataCompleted', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataCompletedService],
    });
  });

  it('should ...', inject(
    [DataCompletedService],
    (service: DataCompletedService) => {
      expect(service).toBeTruthy();
    }
  ));
});
