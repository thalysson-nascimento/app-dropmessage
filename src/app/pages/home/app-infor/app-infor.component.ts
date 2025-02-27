import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-app-infor',
  templateUrl: './app-infor.component.html',
  styleUrls: ['./app-infor.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class AppInforComponent implements OnInit {
  appVersion: string = '';
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (
      Capacitor.getPlatform() === 'ios' ||
      Capacitor.getPlatform() === 'android'
    ) {
      App.getInfo().then((info) => {
        this.appVersion = info.version;
      });
    }
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
}
