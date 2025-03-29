/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LastActiveUsersComponent } from './last-active-users.component';

describe('LastActiveUsersComponent', () => {
  let component: LastActiveUsersComponent;
  let fixture: ComponentFixture<LastActiveUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastActiveUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastActiveUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
