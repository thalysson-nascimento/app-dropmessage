import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ErrorRequestComponent } from '../../../shared/component/error-request/error-request.component';
import { FEATURES_BY_PLAN } from '../../../shared/constantes/features-by-plan.const';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';
import {
  StripeProduct,
  SubscriptionAIResponse,
} from '../../../shared/interface/subscription-ai.interfaces';
import { ListSubscriptionAiService } from '../../../shared/service/list-subscription-ai/list-subscription-ai.service';
import { SignalService } from '../../../shared/service/signal/signal.service';
import { ListSubscriptionLoadingComponent } from '../list-subscription/list-subscription-loading/list-subscription-loading.component';

type PlanType = 'basic' | 'pro' | 'premium';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: boolean;
}

// 🔥 EXATAMENTE O QUE O HTML ESPERA
interface PlanOption {
  id: string;
  type: PlanType;
  metadata: {
    id: string;
    ammount?: string;
    discountLabel?: string;
    durationLabel: string;
    isBestValue?: string;
    originalPrice?: string;
    pricePerMonth: string;
  };
}

@Component({
  selector: 'app-list-subscription-ai',
  templateUrl: './list-subscription-ai.component.html',
  styleUrls: ['./list-subscription-ai.component.scss'],
  standalone: true,
  imports: [
    ButtonDirective,
    ErrorRequestComponent,
    ListSubscriptionLoadingComponent,
    TranslateModule,
  ],
})
export class ListSubscriptionAiComponent implements OnInit {
  isChangingPlans = false;
  features: Feature[] = [];

  allPlans: PlanOption[] = [];

  // 🔥 TIPADO CORRETAMENTE (resolve erro do click)
  planTypes: { id: PlanType; label: string }[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'pro', label: 'Pro' },
    { id: 'premium', label: 'Premium' },
  ];

  selectedPlanType: PlanType = 'pro';

  // 🔥 UI
  plans: PlanOption[] = [];

  // 🔥 DADOS ORIGINAIS (API)
  private originalPlansMap: Record<string, StripeProduct> = {};

  selectedPlanId!: string;

  loading = false;
  error = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private signalService: SignalService<StripeProduct>,
    private translate: TranslateService,
    private listSubscriptionAiService: ListSubscriptionAiService
  ) {}

  ngOnInit(): void {
    this.loadListSubscription();
  }

  // =============================
  // 🔥 API
  // =============================
  loadListSubscription() {
    this.loading = true;

    this.listSubscriptionAiService.subscriptions().subscribe({
      next: (response) => {
        console.log('Response from API:', response);

        this.buildPlans(response);
        this.updatePlans();

        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  // =============================
  // 🔥 MAPPER (SEM QUEBRAR HTML)
  // =============================
  private buildPlans(data: SubscriptionAIResponse) {
    this.originalPlansMap = {};
    const allPlans: PlanOption[] = [];

    const process = (products: StripeProduct[], type: PlanType) => {
      products.forEach((product) => {
        this.originalPlansMap[product.id] = product;

        allPlans.push({
          id: product.id,
          type,
          metadata: {
            id: product.prices?.[0]?.priceId,
            ammount: product.metadata.ammount,
            discountLabel: product.metadata.discountLabel,
            durationLabel: product.metadata.durationLabel,
            isBestValue: product.metadata.isBestValue,
            originalPrice: product.metadata.originalPrice,
            pricePerMonth: product.metadata.pricePerMonth,
          },
        });
      });
    };

    process(data.basic, 'basic');
    process(data.pro, 'pro');
    process(data.premium, 'premium');

    this.allPlans = allPlans; // 🔥 guarda todos
  }

  // =============================
  // 🔥 FILTRO
  // =============================
  updatePlans() {
    this.plans = this.allPlans.filter((p) => p.type === this.selectedPlanType);

    const lang = this.translate.currentLang === 'pt' ? 'pt' : 'en';

    const rawFeatures = FEATURES_BY_PLAN[this.selectedPlanType];

    this.features = rawFeatures.map((f) => ({
      id: f.id,
      title: f.title[lang],
      description: f.description[lang],
      icon: f.icon,
      highlight: f.highlight,
    }));

    this.selectedPlanId = this.plans[0]?.id;
  }

  // 🔥 AGORA NÃO DÁ MAIS ERRO
  selectPlanType(type: PlanType) {
    this.isChangingPlans = true;

    setTimeout(() => {
      this.selectedPlanType = type;
      this.updatePlans();
      this.isChangingPlans = false;
    }, 150);
  }

  selectPlan(planId: string): void {
    this.selectedPlanId = planId;
  }

  isSelected(planId: string): boolean {
    return this.selectedPlanId === planId;
  }

  // =============================
  // 🔥 ENVIA OBJETO ORIGINAL
  // =============================
  subscribe(): void {
    const originalProduct = this.originalPlansMap[this.selectedPlanId];

    console.log('🔥 ENVIANDO ORIGINAL:', originalProduct);

    this.signalService.set(originalProduct);
    this.router.navigateByUrl('home/checkout-payment');
  }

  goToProfile() {
    this.router.navigateByUrl('home/main/profile');
  }
}
