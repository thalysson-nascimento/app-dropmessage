/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConfirmRewardService } from './confirm-reward.service';

describe('Service: ConfirmReward', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmRewardService]
    });
  });

  it('should ...', inject([ConfirmRewardService], (service: ConfirmRewardService) => {
    expect(service).toBeTruthy();
  }));
});
