/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCompleteComponent } from './data-complete.component';

describe('DataCompleteComponent', () => {
  let component: DataCompleteComponent;
  let fixture: ComponentFixture<DataCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataCompleteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
