/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadShimmerComponent } from './load-shimmer.component';

describe('LoadShimmerComponent', () => {
  let component: LoadShimmerComponent;
  let fixture: ComponentFixture<LoadShimmerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadShimmerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
