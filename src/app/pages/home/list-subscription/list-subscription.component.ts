import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { App } from '@capacitor/app';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorRequestComponent } from '../../../shared/component/error-request/error-request.component';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';
import { Product } from '../../../shared/interface/product.interface';
import { ListSubscriptionService } from '../../../shared/service/list-subscription/list-subscription.service';
import { SignalService } from '../../../shared/service/signal/signal.service';
import { ListSubscriptionLoadingComponent } from './list-subscription-loading/list-subscription-loading.component';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: boolean;
}

interface Plan {
  id: string;
  durationLabel: string;
  pricePerMonth: number;
  ammount?: number;
  originalPrice?: number;
  discountLabel?: string;
  isBestValue?: boolean;
}

@Component({
  selector: 'app-list-subscription',
  templateUrl: './list-subscription.component.html',
  styleUrls: ['./list-subscription.component.scss'],
  imports: [
    ButtonDirective,
    ErrorRequestComponent,
    ListSubscriptionLoadingComponent,
    TranslateModule,
    CurrencyPipe,
  ],
  standalone: true,
})
export class ListSubscriptionComponent implements OnInit {
  selectedPlanId!: string;

  features: Feature[] = [
    {
      id: 'f1',
      title: 'Unlimited Likes',
      description: 'Swipe and like as much as you want, no limits',
      icon: 'favorite',
      highlight: true,
    },
    {
      id: 'f2',
      title: 'Global Matching',
      description: 'Connect with people from anywhere in the world',
      icon: 'public',
    },
    {
      id: 'f3',
      title: 'See Who Likes You',
      description: 'Find out who liked you and match instantly',
      icon: 'visibility',
    },
    {
      id: 'f4',
      title: 'More Matches Daily',
      description: 'Increase your chances of matching every day',
      icon: 'whatshot',
    },
    {
      id: 'f5',
      title: 'Unlimited Reactions',
      description: 'Respond to notifications without restrictions',
      icon: 'bolt',
    },
  ];
  plans: any[] = [];
  loading: boolean = true;
  error: boolean = false;
  listSubscription!: Product[];
  state!: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private listSubscriptionService: ListSubscriptionService,
    private signalService: SignalService<Product>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadListSubscription();

    this.route.queryParams.subscribe((params) => {
      this.state = params['path'];
    });
  }

  loadListSubscription() {
    this.listSubscriptionService.subscriptions().subscribe({
      next: (response) => {
        console.log('Response from API:', response);
        this.plans = response.reverse();
        this.loading = false;
        this.listSubscription = response;
        this.selectedPlanId = this.plans[0].id;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  selectPlan(planId: string): void {
    this.selectedPlanId = planId;
  }

  isSelected(planId: string): boolean {
    return this.selectedPlanId === planId;
  }

  subscribe(): void {
    const selectedPlan = this.plans.find((p) => p.id === this.selectedPlanId);
    this.signalService.set(selectedPlan);
    this.router.navigateByUrl('home/checkout-payment');
  }

  navigateBackUsingApp() {
    if (isPlatformBrowser(this.platformId)) {
      App.addListener('backButton', () => {
        if (this.state) {
          this.router.navigateByUrl(this.state);
          return;
        }
        this.router.navigateByUrl('home/main/profile');
      });
    }
  }

  goToProfile() {
    if (this.state) {
      this.router.navigateByUrl(this.state);
      this.navigateBackUsingApp();
      return;
    }
    this.router.navigateByUrl('home/main/profile');
    this.navigateBackUsingApp();
  }
}
