/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PlanActiveSignatureComponent } from './plan-active-signature.component';

describe('PlanActiveSignatureComponent', () => {
  let component: PlanActiveSignatureComponent;
  let fixture: ComponentFixture<PlanActiveSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanActiveSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanActiveSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
