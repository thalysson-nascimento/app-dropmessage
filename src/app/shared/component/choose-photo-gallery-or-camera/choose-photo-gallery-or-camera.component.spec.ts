/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePhotoGalleryOrCameraComponent } from './choose-photo-gallery-or-camera.component';

describe('ChoosePhotoGalleryOrCameraComponent', () => {
  let component: ChoosePhotoGalleryOrCameraComponent;
  let fixture: ComponentFixture<ChoosePhotoGalleryOrCameraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChoosePhotoGalleryOrCameraComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePhotoGalleryOrCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
