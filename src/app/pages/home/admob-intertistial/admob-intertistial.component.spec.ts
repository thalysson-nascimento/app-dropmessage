/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdmobIntertistialComponent } from './admob-intertistial.component';

describe('AdmobIntertistialComponent', () => {
  let component: AdmobIntertistialComponent;
  let fixture: ComponentFixture<AdmobIntertistialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmobIntertistialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmobIntertistialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
