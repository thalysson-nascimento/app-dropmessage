/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardLoadingShimmerComponent } from './card-loading-shimmer.component';

describe('CardLoadingShimmerComponent', () => {
  let component: CardLoadingShimmerComponent;
  let fixture: ComponentFixture<CardLoadingShimmerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardLoadingShimmerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardLoadingShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
