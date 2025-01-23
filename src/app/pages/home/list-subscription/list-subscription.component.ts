import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';

import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { ErrorComponent } from '../../../shared/component/error/error.component';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { Product } from '../../../shared/interface/product.interface';
import { ListSubscriptionService } from '../../../shared/service/list-subscription/list-subscription.service';

const swiper = new Swiper('.swiper', {
  modules: [Navigation, Pagination],
});

const SharedComponents = [
  ButtonStyleDirective,
  LoadShimmerComponent,
  ErrorComponent,
];
const CoreModule = [CommonModule];

@Component({
  selector: 'app-list-subscription',
  templateUrl: './list-subscription.component.html',
  styleUrls: ['./list-subscription.component.scss'],
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListSubscriptionComponent implements OnInit {
  buttonDisalbled: boolean = false;
  isLoading: boolean = true;
  errorRequest: boolean = false;
  listSubscription: Product[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private listSubscriptionService: ListSubscriptionService
  ) {}

  ngOnInit() {
    this.loadListSubscription();
  }

  ngAfterViewInit(): void {
    this.initializationSwipper();
  }

  initializationSwipper() {
    new Swiper('.swiper', {
      direction: 'horizontal',
      spaceBetween: 16,
      modules: [Navigation, Pagination],
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
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

  createSessionPayment(priceId: string) {
    console.log('assinar plano', priceId);
    // this.buttonDisalbled = true;
  }

  loadListSubscription() {
    this.listSubscriptionService.subscriptions().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.listSubscription = response;
      },
      error: () => {
        this.errorRequest = true;
        this.isLoading = false;
      },
    });
  }

  timerSubscription(interval: string, invervalCount: number) {
    if (interval === 'week') {
      return 'plano de assinatura por 7 dias';
    } else if (interval === 'month' && invervalCount === 1) {
      return 'plano de assinatura por um mês';
    }
    return 'plano de assinatura por seis meses';
  }
}
