/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BottomSheetErrorRequestComponent } from './bottom-sheet-error-request.component';

describe('BottomSheetErrorRequestComponent', () => {
  let component: BottomSheetErrorRequestComponent;
  let fixture: ComponentFixture<BottomSheetErrorRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BottomSheetErrorRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomSheetErrorRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
