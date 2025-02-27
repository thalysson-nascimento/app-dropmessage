import {
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { BottomSheetComponent } from '../../bottom-sheet/bottom-sheet.component';
import { TrackAction } from '../../interface/track-action.interface';
import { LoggerService } from '../../service/logger/logger.service';

@Component({
  selector: 'app-choose-photo-gallery-or-camera',
  templateUrl: './choose-photo-gallery-or-camera.component.html',
  styleUrls: ['./choose-photo-gallery-or-camera.component.scss'],
  imports: [TranslateModule],
  standalone: true,
})
export class ChoosePhotoGalleryOrCameraComponent implements OnDestroy {
  cameraImage!: string | null;
  pageView: string = 'DatingMatch:ChoosePhotoGalleryOrCamera';
  destroy$: Subject<void> = new Subject<void>();

  @Output() imageSelected = new EventEmitter<string | null>();

  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    private renderer: Renderer2,
    private loggerService: LoggerService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'user_choose_take_photo',
      event: 'click',
      label: 'button:take_photo',
      message: 'tirar foto',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();

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

    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'user_choose_gallery',
      event: 'click',
      label: 'button:choose_gallery',
      message: 'escolher da galeria',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();

    this.dismiss();
  }
}
