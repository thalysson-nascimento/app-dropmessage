import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { ErrorComponent } from '../../../shared/component/error/error.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { ActiveSubscription } from '../../../shared/interface/active-subscription.interface';
import { CancelSubscriptionService } from '../../../shared/service/cancel-subscription/cancel-subscription.service';
import { SignalService } from '../../../shared/service/signal/signal.service';

const SharedComponents = [ButtonStyleDirective, ModalComponent, ErrorComponent];

@Component({
  selector: 'app-plan-active-signature',
  templateUrl: './plan-active-signature.component.html',
  styleUrls: ['./plan-active-signature.component.scss'],
  standalone: true,
  imports: [CommonModule, ...SharedComponents],
})
export class PlanActiveSignatureComponent implements OnInit {
  subscription: ActiveSubscription | null = null;
  buttonDisalbled: boolean = false;
  @ViewChild('modalCancelSignature') modalCancelSignature!: ModalComponent;
  showError: boolean = false;

  constructor(
    private signalService: SignalService<ActiveSubscription>,
    private router: Router,
    private cancelSubscriptionService: CancelSubscriptionService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.subscription = untracked(() => this.signalService.getValue());
  }

  ngOnInit() {
    this.subscription;
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

  cancelSubscription() {
    this.buttonDisalbled = true;
    const subscription = this.subscription?.data?.subscription;

    if (subscription) {
      this.cancelSubscriptionService.cancel(subscription).subscribe({
        next: () => {
          this.buttonDisalbled = false;
          this.goToProfile();
        },
        error: () => {
          this.showError = true;
          this.buttonDisalbled = false;
        },
      });
    }
  }
}
