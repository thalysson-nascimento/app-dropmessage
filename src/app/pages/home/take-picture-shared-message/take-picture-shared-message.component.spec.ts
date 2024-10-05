/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TakePictureSharedMessageComponent } from './take-picture-shared-message.component';

describe('TakePictureSharedMessageComponent', () => {
  let component: TakePictureSharedMessageComponent;
  let fixture: ComponentFixture<TakePictureSharedMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakePictureSharedMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakePictureSharedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
