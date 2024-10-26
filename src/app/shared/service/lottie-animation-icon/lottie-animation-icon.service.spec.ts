/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { LottieAnimationIconService } from './lottie-animation-icon.service';

describe('Service: LottieAnimationIcon', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LottieAnimationIconService],
    });
  });

  it('should ...', inject(
    [LottieAnimationIconService],
    (service: LottieAnimationIconService) => {
      expect(service).toBeTruthy();
    }
  ));
});
