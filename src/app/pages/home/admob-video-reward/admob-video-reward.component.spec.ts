/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdmobVideoRewardComponent } from './admob-video-reward.component';

describe('AdmobVideoRewardComponent', () => {
  let component: AdmobVideoRewardComponent;
  let fixture: ComponentFixture<AdmobVideoRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmobVideoRewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmobVideoRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
