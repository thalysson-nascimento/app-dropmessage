import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NotificationModel } from '../../../../../shared/interface/notification.interface';
import { NotificationItemComponent } from '../notification-item/notification-item.component';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  imports: [NotificationItemComponent, CommonModule],
  standalone: true,
})
export class NotificationListComponent {
  @Input() notifications: NotificationModel[] = [];
}
