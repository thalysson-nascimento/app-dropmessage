/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListChatComponent } from './list-chat.component';

describe('ListChatComponent', () => {
  let component: ListChatComponent;
  let fixture: ComponentFixture<ListChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
