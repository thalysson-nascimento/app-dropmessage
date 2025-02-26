import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Subject } from 'rxjs';
import { ButtonStyleDirective } from '../../../../shared/directives/button-style/button-style.directive';
import { InputCustomDirective } from '../../../../shared/directives/input-custom/input-custom.directive';

const SharedComponent = [ButtonStyleDirective, InputCustomDirective];

@Component({
  selector: 'app-request-support',
  templateUrl: './request-support.component.html',
  styleUrls: ['./request-support.component.scss'],
  standalone: true,
  imports: [...SharedComponent],
})
export class RequestSupportComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToSupport() {
    this.router.navigateByUrl('home/support');
    this.navigateBackUsingApp();
  }

  navigateBackUsingApp() {
    if (isPlatformBrowser(this.platformId)) {
      App.addListener('backButton', () => {
        this.router.navigateByUrl('home/support');
      });
    }
  }
}
