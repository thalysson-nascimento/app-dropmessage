// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import {
//   CUSTOM_ELEMENTS_SCHEMA,
//   Component,
//   Inject,
//   OnInit,
//   PLATFORM_ID,
// } from '@angular/core';
// import { Router } from '@angular/router';
// import { App } from '@capacitor/app';

// import Swiper from 'swiper';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { Navigation, Pagination } from 'swiper/modules';
// import { ErrorComponent } from '../../../shared/component/error/error.component';
// import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
// import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
// import { Product } from '../../../shared/interface/product.interface';
// import { ListSubscriptionService } from '../../../shared/service/list-subscription/list-subscription.service';
// import { SignalService } from '../../../shared/service/signal/signal.service';

// const swiper = new Swiper('.swiper', {
//   modules: [Navigation, Pagination],
// });

// const SharedComponents = [
//   ButtonStyleDirective,
//   LoadShimmerComponent,
//   ErrorComponent,
// ];
// const CoreModule = [CommonModule];

// @Component({
//   selector: 'app-list-subscription',
//   templateUrl: './list-subscription.component.html',
//   styleUrls: ['./list-subscription.component.scss'],
//   standalone: true,
//   imports: [...SharedComponents, ...CoreModule],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// })
// export class ListSubscriptionComponent implements OnInit {
//   buttonDisalbled: boolean = false;
//   isLoading: boolean = true;
//   errorRequest: boolean = false;
//   listSubscription: Product[] = [];

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private router: Router,
//     private listSubscriptionService: ListSubscriptionService,
//     private signalService: SignalService<Product>
//   ) {}

//   ngOnInit() {
//     this.loadListSubscription();
//   }

//   ngAfterViewInit(): void {
//     this.initializationSwipper();
//   }

//   initializationSwipper() {
//     new Swiper('.swiper', {
//       direction: 'horizontal',
//       spaceBetween: 16,
//       modules: [Navigation, Pagination],
//       pagination: {
//         el: '.swiper-pagination',
//         clickable: true,
//       },
//     });
//   }

//   navigateBackUsingApp() {
//     if (isPlatformBrowser(this.platformId)) {
//       App.addListener('backButton', () => {
//         this.router.navigateByUrl('home/main/profile');
//       });
//     }
//   }

//   goToProfile() {
//     this.router.navigateByUrl('home/main/profile');
//     this.navigateBackUsingApp();
//   }

//   createSessionPayment(product: Product) {
//     this.signalService.set(product);
//     this.router.navigateByUrl('home/checkout-payment');
//     // this.buttonDisalbled = true;
//   }

//   loadListSubscription() {
//     this.listSubscriptionService.subscriptions().subscribe({
//       next: (response) => {
//         this.isLoading = false;
//         this.listSubscription = response;
//       },
//       error: () => {
//         this.errorRequest = true;
//         this.isLoading = false;
//       },
//     });
//   }

//   timerSubscription(interval: string, invervalCount: number) {
//     if (interval === 'week') {
//       return 'plano de assinatura por 7 dias';
//     } else if (interval === 'month' && invervalCount === 1) {
//       return 'plano de assinatura por 1 mês';
//     }
//     return 'plano de assinatura por 6 meses';
//   }
// }
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';
import { Product } from '../../../shared/interface/product.interface';
import { ListSubscriptionService } from '../../../shared/service/list-subscription/list-subscription.service';
import { SignalService } from '../../../shared/service/signal/signal.service';

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
  originalPrice?: number;
  discountLabel?: string;
  isBestValue?: boolean;
}

@Component({
  selector: 'app-list-subscription',
  templateUrl: './list-subscription.component.html',
  styleUrls: ['./list-subscription.component.scss'],
  imports: [ButtonDirective],
  standalone: true,
})
export class ListSubscriptionComponent {
  selectedPlanId: string = 'plan-12';

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
  plans: Plan[] = [
    {
      id: 'plan-12',
      durationLabel: '6 Months',
      pricePerMonth: 4.99,
      originalPrice: 119.88,
      discountLabel: 'Save 60%',
      isBestValue: true,
    },
    {
      id: 'plan-6',
      durationLabel: '3 Months',
      pricePerMonth: 7.99,
      discountLabel: 'Save 35%',
    },
    {
      id: 'plan-1',
      durationLabel: '1 Month',
      pricePerMonth: 12.99,
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private listSubscriptionService: ListSubscriptionService,
    private signalService: SignalService<Product>
  ) {}

  selectPlan(planId: string): void {
    this.selectedPlanId = planId;
  }

  isSelected(planId: string): boolean {
    return this.selectedPlanId === planId;
  }

  subscribe(): void {
    const selectedPlan = this.plans.find((p) => p.id === this.selectedPlanId);
    console.log('Selected plan:', selectedPlan);
  }

  navigateBackUsingApp() {
    if (isPlatformBrowser(this.platformId)) {
      App.addListener('backButton', () => {
        this.router.navigateByUrl('home/main/profile');
      });
    }
  }

  goToProfile() {
    this.router.navigateByUrl('home/main/profile');
    this.navigateBackUsingApp();
  }
}
