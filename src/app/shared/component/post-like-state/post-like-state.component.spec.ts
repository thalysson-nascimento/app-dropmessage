/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PostLikeStateComponent } from './post-like-state.component';

describe('PostLikeStateComponent', () => {
  let component: PostLikeStateComponent;
  let fixture: ComponentFixture<PostLikeStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostLikeStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostLikeStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
