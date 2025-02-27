/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppInforComponent } from './app-infor.component';

describe('AppInforComponent', () => {
  let component: AppInforComponent;
  let fixture: ComponentFixture<AppInforComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppInforComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
