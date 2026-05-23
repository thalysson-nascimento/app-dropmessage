/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ListSubscriptionAiService } from './list-subscription-ai.service';

describe('Service: ListSubscriptionAi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListSubscriptionAiService]
    });
  });

  it('should ...', inject([ListSubscriptionAiService], (service: ListSubscriptionAiService) => {
    expect(service).toBeTruthy();
  }));
});
