/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActiveSignatureComponent } from './active-signature.component';

describe('ActiveSignatureComponent', () => {
  let component: ActiveSignatureComponent;
  let fixture: ComponentFixture<ActiveSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
