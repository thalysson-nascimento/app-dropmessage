import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { TranslateModule } from '@ngx-translate/core';
import { ActiveSignatureLikeUserComponent } from '../../../shared/component/active-signature-like-user/active-signature-like-user.component';
import { ErrorComponent } from '../../../shared/component/error/error.component';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { Notification } from '../../../shared/interface/notification.interface';
import { ActiveSubscriptionService } from '../../../shared/service/active-subscription/active-subscription.service';
import { NotificationService } from '../../../shared/service/notification/notification.service';

const CoreModule = [CommonModule, TranslateModule];
const SharedComponent = [
  ErrorComponent,
  LoadShimmerComponent,
  ActiveSignatureLikeUserComponent,
];

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [...CoreModule, ...SharedComponent],
  standalone: true,
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  isLoading: boolean = true;
  errorRequest: boolean = false;
  userNotification: boolean = false;
  showCardSubscription: boolean = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private activeSubscriptionService: ActiveSubscriptionService
  ) {}

  ngOnInit() {
    this.loadNotification();
    this.activeSubscription();
  }

  navigateBackUsingApp() {
    if (isPlatformBrowser(this.platformId)) {
      App.addListener('backButton', () => {
        this.router.navigateByUrl('home/profile');
      });
    }
  }

  goToProfile() {
    this.router.navigateByUrl('home/profile');
    this.navigateBackUsingApp();
  }

  loadNotification() {
    this.notificationService.notification().subscribe({
      next: (response) => {
        if (response.length === 0) {
          this.userNotification = true;
        }
        this.notifications = response;
      },
      error: (error) => {
        console.error(error);
        this.errorRequest = true;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.errorRequest = false;
      },
    });
  }

  filterFirstUserName(userName: string) {
    return userName.split(' ')[0];
  }

  activeSubscription() {
    this.activeSubscriptionService.active().subscribe({
      next: (response) => {
        if (
          !response.activeSubscription ||
          response.data?.status === 'canceled'
        ) {
          this.showCardSubscription = true;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
