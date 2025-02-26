import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { App } from '@capacitor/app';
import { Subject, takeUntil } from 'rxjs';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { LoggerService } from '../../../shared/service/logger/logger.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
  imports: [RouterModule],
  standalone: true,
})
export class SupportComponent implements OnInit, OnDestroy {
  pageView: string = 'DatingMatch:Support';
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private loggerService: LoggerService
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToProfile() {
    this.router.navigateByUrl('home/profile');
    this.navigateBackUsingApp();
  }

  navigateBackUsingApp() {
    if (isPlatformBrowser(this.platformId)) {
      App.addListener('backButton', () => {
        const logger: TrackAction = {
          pageView: this.pageView,
          category: 'support:return_page',
          event: 'click',
          label: 'button:icon_back',
          message: 'Voltar para pagina de perfil',
          statusCode: 200,
          level: 'info',
        };

        this.loggerService
          .info(logger)
          .pipe(takeUntil(this.destroy$))
          .subscribe();

        this.router.navigateByUrl('home/post-messages');
      });
    }
  }

  goToRequestSupport() {
    this.router.navigateByUrl('home/support/request-support');
  }

  goToListSupport() {
    this.router.navigateByUrl('home/support/list-support');
  }
}
