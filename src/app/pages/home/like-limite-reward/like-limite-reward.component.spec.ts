/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LikeLimiteRewardComponent } from './like-limite-reward.component';

describe('LikeLimiteRewardComponent', () => {
  let component: LikeLimiteRewardComponent;
  let fixture: ComponentFixture<LikeLimiteRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikeLimiteRewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeLimiteRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
