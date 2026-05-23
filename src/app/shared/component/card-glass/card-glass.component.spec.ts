/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardGlassComponent } from './card-glass.component';

describe('CardGlassComponent', () => {
  let component: CardGlassComponent;
  let fixture: ComponentFixture<CardGlassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardGlassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardGlassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
