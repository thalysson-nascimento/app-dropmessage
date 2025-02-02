/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserFirstPublicationPostComponent } from './user-first-publication-post.component';

describe('UserFirstPublicationPostComponent', () => {
  let component: UserFirstPublicationPostComponent;
  let fixture: ComponentFixture<UserFirstPublicationPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFirstPublicationPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFirstPublicationPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
