import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NotificationService } from '../../service/notification/notification.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  imports: [RouterModule, CommonModule],
  standalone: true,
})
export class MainMenuComponent implements OnInit {
  activeMenu: string = 'likes';
  unreadCount$: Observable<number>;

  constructor(private notificationService: NotificationService) {
    this.unreadCount$ = this.notificationService.unreadCount$;
  }

  ngOnInit() {
    this.notificationService.loadInitialUnreadCount();
  }

  onClick(
    option: 'profile' | 'ai-profiles' | 'likes' | 'notification' | 'chat'
  ) {
    this.activeMenu = option;
  }
}
