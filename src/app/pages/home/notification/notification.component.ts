import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { Notification } from '../../../shared/interface/notification.interface';
import { LottieAnimationIconService } from '../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';
import { NotificationService } from '../../../shared/service/notification/notification.service';

const CoreModule = [NgIf, NgFor];
const SharedComponent = [SystemUnavailableComponent];

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [...CoreModule, ...SharedComponent],
  standalone: true,
})
export class NotificationComponent implements OnInit, AfterViewInit {
  notifications: Notification[] = [];
  isLoading: boolean = true;
  showSystemUnavailable: boolean = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private lottieAnimationIconService: LottieAnimationIconService
  ) {}

  ngOnInit() {
    this.loadNotification();
  }

  ngAfterViewInit(): void {
    this.lottieAnimationIconService.loadLottieAnimation({
      pathIconAnimation: 'loading.json',
      idElement: 'lottie-icon-is-loading',
      loop: true,
      autoplay: true,
    });
  }

  navigateBackUsingApp() {
    if (isPlatformBrowser(this.platformId)) {
      App.addListener('backButton', () => {
        this.router.navigateByUrl('home/profile');
      });
    }
  }

  tryAgain() {
    this.isLoading = true;
    this.showSystemUnavailable = false;
    this.loadNotification();
  }

  goToProfile() {
    this.router.navigateByUrl('home/profile');
    this.navigateBackUsingApp();
  }

  loadNotification() {
    this.notificationService.notification().subscribe({
      next: (response) => {
        console.log(response);
        this.notifications = response;
      },
      error: (error) => {
        console.error(error);
        this.showSystemUnavailable = true;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.showSystemUnavailable = false;
      },
    });
  }
}
