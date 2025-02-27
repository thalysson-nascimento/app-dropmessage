import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  HostListener,
  Renderer2,
} from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { TrackAction } from '../interface/track-action.interface';
import { ExpirationTimerService } from '../service/expiration-timer/expiration-timer.service';
import { LoggerService } from '../service/logger/logger.service';

@Component({
  selector: 'bottom-sheet-overview',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  styleUrl: './bottom-sheet.component.scss',
  templateUrl: './bottom-sheet.component.html',
  imports: [TranslateModule],
})
export class BottomSheetComponent {
  private destroy$: Subject<void> = new Subject<void>();
  componentView: string = 'DatingMatch:BottomSheetChooseTimerPostMessage';

  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    private renderer: Renderer2,
    private router: Router,
    private expirationTimerService: ExpirationTimerService,
    private loggerService: LoggerService
  ) {}

  dismiss(): void {
    const logger: TrackAction = {
      pageView: this.componentView,
      category: 'user_bottom_sheet_post_message',
      event: 'click',
      label: 'button:dismiss',
      message: 'ocultar bottonsheet',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();
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

  selectPostTimer(timer: string) {
    const logger: TrackAction = {
      pageView: this.componentView,
      category: 'user_bottom_sheet_post_message',
      event: 'click',
      label: 'button:action_timer',
      message: timer,
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();

    this.router.navigate(['/home/take-picture-shared-message']);
    this.bottomSheetRef.dismiss();
    this.expirationTimerService.setExpirationTimer(timer);
  }
}
