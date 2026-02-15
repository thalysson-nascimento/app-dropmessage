/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IaProfileDetailsInfoComponent } from './ia-profile-details-info.component';

describe('IaProfileDetailsInfoComponent', () => {
  let component: IaProfileDetailsInfoComponent;
  let fixture: ComponentFixture<IaProfileDetailsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IaProfileDetailsInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IaProfileDetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
