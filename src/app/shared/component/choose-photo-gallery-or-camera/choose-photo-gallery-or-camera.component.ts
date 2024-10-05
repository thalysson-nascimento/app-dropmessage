import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  Renderer2,
} from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BottomSheetComponent } from '../../bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'app-choose-photo-gallery-or-camera',
  templateUrl: './choose-photo-gallery-or-camera.component.html',
  styleUrls: ['./choose-photo-gallery-or-camera.component.scss'],
})
export class ChoosePhotoGalleryOrCameraComponent {
  cameraImage!: string | null;
  @Output() imageSelected = new EventEmitter<string | null>();

  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    private renderer: Renderer2,
    private router: Router
  ) {}

  dismiss(): void {
    this.bottomSheetRef.dismiss();
  }

  @HostListener('mousedown', ['$event.target'])
  onMouseDown(target: HTMLElement) {
    if (target.closest('.action-timer')) {
      const liElement = target.closest('li');
      this.renderer.addClass(liElement, 'active');
    }
  }

  // Listener para soltar o clique
  @HostListener('mouseup', ['$event.target'])
  onMouseUp(target: HTMLElement) {
    if (target.closest('.action-timer')) {
      const liElement = target.closest('li');
      this.renderer.removeClass(liElement, 'active');
    }
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    this.cameraImage = image.webPath || null;
    this.imageSelected.emit(this.cameraImage);
    this.dismiss();
  }

  async chooseFromGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    this.cameraImage = image.webPath || null;
    this.imageSelected.emit(this.cameraImage);
    this.dismiss();
  }
}
