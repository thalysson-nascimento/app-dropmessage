/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProfessionService } from './profession.service';

describe('Service: Profession', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfessionService]
    });
  });

  it('should ...', inject([ProfessionService], (service: ProfessionService) => {
    expect(service).toBeTruthy();
  }));
});
