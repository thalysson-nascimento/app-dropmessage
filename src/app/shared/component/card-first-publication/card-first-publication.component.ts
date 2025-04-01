import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { BottomSheetComponent } from '../../bottom-sheet/bottom-sheet.component';
import { TrackAction } from '../../interface/track-action.interface';
import { LoggerService } from '../../service/logger/logger.service';

const CoreModules = [TranslateModule];

@Component({
  selector: 'app-card-first-publication',
  templateUrl: './card-first-publication.component.html',
  styleUrls: ['./card-first-publication.component.scss'],
  imports: [...CoreModules],
  standalone: true,
})
export class CardFirstPublicationComponent implements OnInit {
  @Input()
  gender: string = 'homem';
  private destroy$: Subject<void> = new Subject<void>();

  pageView: string = 'DatingMatch:PostMessage';

  constructor(
    private router: Router,
    private loggerService: LoggerService,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit() {}

  goToSharedPostMessage() {
    const logger: TrackAction = {
      pageView: this.pageView,
      category: 'user_post_message',
      event: 'click',
      label: 'button:icon_camera',
      message: 'Abrir modal camera',
      statusCode: 200,
      level: 'info',
    };

    this.loggerService.info(logger).pipe(takeUntil(this.destroy$)).subscribe();

    this.bottomSheet.open(BottomSheetComponent);
  }
}
