/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmobVideoRewardCardFreeTrialComponent } from './admob-video-reward.component';

describe('AdmobVideoRewardCardFreeTrialComponent', () => {
  let component: AdmobVideoRewardCardFreeTrialComponent;
  let fixture: ComponentFixture<AdmobVideoRewardCardFreeTrialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmobVideoRewardCardFreeTrialComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmobVideoRewardCardFreeTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
