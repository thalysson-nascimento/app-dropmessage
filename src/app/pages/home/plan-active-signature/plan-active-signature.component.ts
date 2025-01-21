import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { ActiveSubscription } from '../../../shared/interface/active-subscription.interface';
import { SignalService } from '../../../shared/service/signal/signal.service';

const SharedComponents = [ButtonStyleDirective];

@Component({
  selector: 'app-plan-active-signature',
  templateUrl: './plan-active-signature.component.html',
  styleUrls: ['./plan-active-signature.component.scss'],
  standalone: true,
  imports: [CommonModule, ...SharedComponents],
})
export class PlanActiveSignatureComponent implements OnInit {
  subscription: ActiveSubscription | null = null;

  constructor(
    private signalService: SignalService<ActiveSubscription>,
    private router: Router,

    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.subscription = untracked(() => this.signalService.getValue());
  }

  ngOnInit() {
    this.subscription;
    console.log('Subscription:', this.subscription);
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
