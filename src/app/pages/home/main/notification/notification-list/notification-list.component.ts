import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationItem } from '../../../../../shared/interface/notification.interface';
import { NotificationItemComponent } from '../notification-item/notification-item.component';
import { PremiumBannerComponent } from '../premium-banner/premium-banner.component';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  imports: [NotificationItemComponent, CommonModule, PremiumBannerComponent],
  standalone: true,
})
export class NotificationListComponent {
  @Input() subscriptions: boolean = false;
  @Input() notifications: NotificationItem[] = [];

  constructor(private router: Router) {}

  public onSubscribe() {
    this.router.navigate(['home/list-subscription'], {
      queryParams: { path: 'home/main/notification' },
    });
  }
}
