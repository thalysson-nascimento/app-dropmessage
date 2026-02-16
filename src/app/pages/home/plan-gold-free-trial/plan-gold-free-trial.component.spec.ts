/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PlanGoldFreeTrialComponent } from './plan-gold-free-trial.component';

describe('PlanGoldFreeTrialComponent', () => {
  let component: PlanGoldFreeTrialComponent;
  let fixture: ComponentFixture<PlanGoldFreeTrialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanGoldFreeTrialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanGoldFreeTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
