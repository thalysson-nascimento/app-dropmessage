/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DurationOptionComponent } from './duration-option.component';

describe('DurationOptionComponent', () => {
  let component: DurationOptionComponent;
  let fixture: ComponentFixture<DurationOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DurationOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
