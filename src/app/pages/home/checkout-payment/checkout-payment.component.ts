import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Stripe, StripeElements, loadStripe } from '@stripe/stripe-js';
import { ErrorModalComponent } from '../../../shared/component/error-modal/error-modal.component';
import { ErrorComponent } from '../../../shared/component/error/error.component';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { Product } from '../../../shared/interface/product.interface';
import { SessionPaymentIntentService } from '../../../shared/service/session-payment-intent/session-payment-intent.service';
import { SignalService } from '../../../shared/service/signal/signal.service';
import { StripePublicKeyService } from '../../../shared/service/stripe-public-key/stripe-public-key.service';

const CoreModule = [CommonModule, TranslateModule];
const SharedModule = [
  ErrorComponent,
  LoadShimmerComponent,
  ErrorModalComponent,
];

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
  standalone: true,
  imports: [...CoreModule, ...SharedModule],
})
export class CheckoutPaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  planSubscription!: Product;
  isLoading: boolean = true;
  errorRequest: boolean = false;
  clientSecret: string = '';
  isDisabled: boolean = false;
  isLoadingButton: boolean = false;
  @ViewChild('modalErrorRequest') modalErrorRequest!: ErrorModalComponent;
  typeErrorModal: 'success' | 'warn' | 'error' = 'success';
  errorRequestMessage: string | undefined;

  constructor(
    private sessionPaymentIntentService: SessionPaymentIntentService,
    private router: Router,
    private signalService: SignalService<Product>,
    private stripePublicKeyService: StripePublicKeyService
  ) {
    const signal = untracked(() => this.signalService.getValue());

    if (signal) {
      this.planSubscription = signal;
    }
  }

  async ngOnInit() {
    this.stripePublicKeyService.stripePublicKey().subscribe({
      next: async (response) => {
        const publicApi = response.publicKey;
        this.stripe = await loadStripe(publicApi);
        if (!this.stripe) {
          console.error('Erro ao carregar Stripe');
          return;
        }
      },
    });

    const price = this.planSubscription?.prices[0].priceId;

    if (!price) {
      this.errorRequest = true;
      throw Error('Nenhum ID de precificação encontrado');
    }

    this.sessionPaymentIntentService.createSession(price).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.clientSecret = response.client_secret;

        setTimeout(() => {
          if (!this.stripe) {
            console.error('Stripe não está inicializado.');
            return;
          }
          this.handleFormPaymentStrip(this.stripe, response);
        }, 100);
      },
      error: () => {
        this.isLoading = false;
        this.errorRequest = true;
      },
    });
  }

  handleFormPaymentStrip(stripe: Stripe, response: { client_secret: string }) {
    this.elements = stripe.elements({
      clientSecret: response.client_secret,
    });

    const paymentElement = this.elements.create('payment', {
      layout: 'tabs', // Layout pode ser 'tabs' ou 'accordion'
    });

    paymentElement.mount('#payment-element');
  }

  async handleExpressCheckout() {
    if (!this.stripe || !this.elements) {
      console.error('Stripe ou Elements não inicializados.');
      return;
    }

    try {
      this.isDisabled = true;
      this.isLoadingButton = true;

      const { error, paymentIntent } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {},
        redirect: 'if_required', // Isso evita redirecionamentos desnecessários
      });

      if (error) {
        this.isDisabled = false;
        this.errorRequestMessage = error.message;
        this.typeErrorModal = 'warn';
        this.modalErrorRequest.openDialog();
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        this.router.navigateByUrl('/home/payment-success');
      } else {
        this.isDisabled = false;
        this.errorRequestMessage = 'Erro no pagamento';
        this.typeErrorModal = 'warn';
        this.modalErrorRequest.openDialog();
      }
    } catch (err) {
      this.isDisabled = false;
      this.errorRequestMessage = 'Erro no pagamento';
      this.typeErrorModal = 'warn';
      this.modalErrorRequest.openDialog();
      console.error('Erro ao processar pagamento:', err);
    }
  }

  timerSubscription(interval: string, invervalCount: number) {
    if (interval === 'week') {
      return 'por 7 dias';
    } else if (interval === 'month' && invervalCount === 1) {
      return 'por 1 mês';
    }
    return 'por 6 meses';
  }

  goToListSubscription() {
    this.router.navigateByUrl('home/list-subscription');
  }
}
