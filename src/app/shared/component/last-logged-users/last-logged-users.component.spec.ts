/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastLoggedUsersComponent } from './last-logged-users.component';

describe('LastLoggedUsersComponent', () => {
  let component: LastLoggedUsersComponent;
  let fixture: ComponentFixture<LastLoggedUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LastLoggedUsersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastLoggedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
