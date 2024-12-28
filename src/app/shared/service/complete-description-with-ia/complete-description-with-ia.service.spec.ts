/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { CompleteDescriptionWithIA } from './complete-description-with-ia.service';

describe('Service: CompleteDescriptionWithIA', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompleteDescriptionWithIA],
    });
  });

  it('should ...', inject(
    [CompleteDescriptionWithIA],
    (service: CompleteDescriptionWithIA) => {
      expect(service).toBeTruthy();
    }
  ));
});
