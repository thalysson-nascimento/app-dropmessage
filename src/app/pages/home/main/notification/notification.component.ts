import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorRequestComponent } from '../../../../shared/component/error-request/error-request.component';
import { LogoDropmessageComponent } from '../../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonDirective } from '../../../../shared/directives/button-ia/button-ia.directive';
import {
  GetNotificationsResponse,
  NotificationFilter,
  NotificationItem,
} from '../../../../shared/interface/notification.interface';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { NotificationListComponent } from './notification-list/notification-list.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [
    LogoDropmessageComponent,
    ErrorRequestComponent,
    ButtonDirective,
    NotificationListComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class NotificationComponent implements OnInit {
  protected readonly skeletonItems = Array.from({ length: 6 });

  public selectedFilter: NotificationFilter = 'ALL';
  public notifications!: GetNotificationsResponse;
  public loading = false;
  public error = false;

  get filtered(): NotificationItem[] {
    if (this.selectedFilter === 'ALL') return this.notifications.items;

    return this.notifications.items.filter((n) =>
      n.type.toLowerCase().includes(this.selectedFilter.toLowerCase())
    );
  }

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.notification().subscribe({
      next: (data) => {
        console.log('Notifications loaded:', data);
        this.notifications = data;
        this.loading = false;
        this.error = false;
        this.notificationService.unreadCount$.next(0);
        this.notificationService.hasUnread$.next(false);
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  goToTakePicture(): void {
    this.router.navigateByUrl('home/take-picture-shared-message');
  }
}
