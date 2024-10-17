/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoDropmessageComponent } from './logo-dropmessage.component';

describe('LogoDropmessageComponent', () => {
  let component: LogoDropmessageComponent;
  let fixture: ComponentFixture<LogoDropmessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogoDropmessageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoDropmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
