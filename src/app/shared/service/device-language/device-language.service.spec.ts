/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeviceLanguageService } from './device-language.service';

describe('Service: DeviceLanguage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceLanguageService]
    });
  });

  it('should ...', inject([DeviceLanguageService], (service: DeviceLanguageService) => {
    expect(service).toBeTruthy();
  }));
});
