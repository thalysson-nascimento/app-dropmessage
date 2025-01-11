/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ReportProblemService } from './report-problem.service';

describe('Service: ReportProblem', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportProblemService],
    });
  });

  it('should ...', inject(
    [ReportProblemService],
    (service: ReportProblemService) => {
      expect(service).toBeTruthy();
    }
  ));
});
