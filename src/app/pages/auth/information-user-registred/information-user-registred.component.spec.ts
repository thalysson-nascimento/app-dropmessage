/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InformationUserRegistredComponent } from './information-user-registred.component';

describe('InformationUserRegistredComponent', () => {
  let component: InformationUserRegistredComponent;
  let fixture: ComponentFixture<InformationUserRegistredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationUserRegistredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationUserRegistredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
