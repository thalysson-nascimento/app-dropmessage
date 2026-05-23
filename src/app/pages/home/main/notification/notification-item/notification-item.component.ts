import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModalComponent } from '../../../../../shared/component/modal/modal.component';
import { ButtonDirective } from '../../../../../shared/directives/button-ia/button-ia.directive';
import { DataConnectChatMessage } from '../../../../../shared/interface/data-connect-chat-message.interface';
import {
  NotificationItem,
  NotificationType,
} from '../../../../../shared/interface/notification.interface';
import { DataConnectChatMessageService } from '../../../../../shared/service/data-connect-chat-message/data-connect-chat-message.service';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  imports: [CommonModule, ModalComponent, ButtonDirective, TranslateModule],
  standalone: true,
  styleUrls: ['./notification-item.component.scss'],
})
export class NotificationItemComponent {
  public notificationSelected!: NotificationItem;

  @Input() notification!: NotificationItem;
  @Output() followToggle = new EventEmitter<string>();

  @ViewChild('modal') modal!: ModalComponent;

  NotificationType = NotificationType;

  constructor(
    private router: Router,
    private dataConnectChatMessageService: DataConnectChatMessageService
  ) {}

  onFollow() {
    this.followToggle.emit(this.notification.id);
  }

  openProfile(profileSelected: NotificationItem) {
    console.log(profileSelected);
  }

  openModal(notificationSelected: NotificationItem) {
    if (notificationSelected) {
      this.notificationSelected = notificationSelected;
      console.log(notificationSelected);
      this.modal.open();
    }
  }

  closeModal() {
    this.modal.close();
  }

  likeUserProfile(
    subscription: boolean,
    notificationSelected: NotificationItem
  ) {
    if (!subscription) {
      this.router.navigate(['home/list-subscription']);
    }
  }

  sendMessage(userSelectForChat: DataConnectChatMessage) {
    console.log(userSelectForChat);
    this.dataConnectChatMessageService.setDataConnectChatMessage(
      userSelectForChat
    );
    this.router.navigateByUrl('home/chat-message');
  }
}
