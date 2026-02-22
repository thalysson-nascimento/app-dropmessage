import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorRequestComponent } from '../../../../shared/component/error-request/error-request.component';
import { LoadShimmerComponent } from '../../../../shared/component/load-shimmer/load-shimmer.component';
import { LogoDropmessageComponent } from '../../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonDirective } from '../../../../shared/directives/button-ia/button-ia.directive';
import {
  NotificationFilter,
  NotificationModel,
} from '../../../../shared/interface/notification.interface';
import { notificationMock } from '../../../../shared/mock/notification.mock';
import { NotificationListComponent } from './notification-list/notification-list.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [
    LogoDropmessageComponent,
    ErrorRequestComponent,
    ButtonDirective,
    LoadShimmerComponent,
    NotificationListComponent,
  ],
  standalone: true,
})
export class NotificationComponent implements OnInit {
  protected readonly skeletonItems = Array.from({ length: 6 });
  selectedFilter: NotificationFilter = 'ALL';
  notifications: NotificationModel[] = notificationMock;
  public loading = true;
  public error = false;

  get filtered(): NotificationModel[] {
    if (this.selectedFilter === 'ALL') return this.notifications;

    return this.notifications.filter((n) =>
      n.type.toLowerCase().includes(this.selectedFilter.toLowerCase())
    );
  }

  constructor(private router: Router) {}

  ngOnInit() {}

  goToTakePicture(): void {
    this.router.navigateByUrl('home/take-picture-shared-message');
  }
}
