import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-take-picture-shared-message',
  templateUrl: './take-picture-shared-message.component.html',
  styleUrls: ['./take-picture-shared-message.component.scss'],
})
export class TakePictureSharedMessageComponent implements OnInit {
  cameraAllowed: boolean = false;
  locationAllowed: boolean = false;
  cameraImage: string | null = null;

  constructor() {}

  ngOnInit() {
    this.checkCameraPermission();
  }

  async checkCameraPermission() {
    const permission = await Camera.requestPermissions({
      permissions: ['camera'],
    });

    if (permission.camera === 'granted') {
      this.cameraAllowed = true;
    } else {
      this.cameraAllowed = false;
    }
  }

  // Tirar foto usando a câmera
  async takePhoto() {
    if (this.cameraAllowed) {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });

      this.cameraImage = image.webPath || null;
    }
  }

  // Pedir permissão novamente
  async requestCameraPermissionAgain() {
    await this.checkCameraPermission();
  }
}
