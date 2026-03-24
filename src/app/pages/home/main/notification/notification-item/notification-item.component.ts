import { CommonModule, DatePipe } from '@angular/common';
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
import {
  NotificationModel,
  NotificationType,
} from '../../../../../shared/interface/notification.interface';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  imports: [
    DatePipe,
    CommonModule,
    ModalComponent,
    ButtonDirective,
    TranslateModule,
  ],
  standalone: true,
  styleUrls: ['./notification-item.component.scss'],
})
export class NotificationItemComponent {
  public notificationSelected!: NotificationModel;

  @Input() notification!: NotificationModel;
  @Output() followToggle = new EventEmitter<string>();

  @ViewChild('modal') modal!: ModalComponent;

  NotificationType = NotificationType;

  constructor(private router: Router) {}

  onFollow() {
    this.followToggle.emit(this.notification.id);
  }

  openProfile(profileSelected: NotificationModel) {
    console.log(profileSelected);
  }

  openModal(notificationSelected: NotificationModel) {
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
    notificationSelected: NotificationModel
  ) {
    if (!subscription) {
      this.router.navigate(['home/list-subscription']);
    }
  }
}
