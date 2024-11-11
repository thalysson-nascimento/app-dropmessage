import { NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { Notification } from '../../../shared/interface/notification.interface';
import { NotificationService } from '../../../shared/service/notification/notification.service';

const CoreModule = [NgIf, NgFor];
const SharedComponent = [LoadShimmerComponent];

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

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadNotification();
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
        console.log(response);
        this.notifications = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
