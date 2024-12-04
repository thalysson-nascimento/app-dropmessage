/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmobVideoRewardComponent } from './admob-video-reward.component';

describe('AdmobVideoRewardComponent', () => {
  let component: AdmobVideoRewardComponent;
  let fixture: ComponentFixture<AdmobVideoRewardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmobVideoRewardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmobVideoRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
