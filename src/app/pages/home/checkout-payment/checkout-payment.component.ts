import { CommonModule } from '@angular/common';
import { Component, OnInit, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { Stripe, StripeElements, loadStripe } from '@stripe/stripe-js';
import { ErrorComponent } from '../../../shared/component/error/error.component';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { Product } from '../../../shared/interface/product.interface';
import { SessionPaymentIntentService } from '../../../shared/service/session-payment-intent/session-payment-intent.service';
import { SignalService } from '../../../shared/service/signal/signal.service';
import { StripePublicKeyService } from '../../../shared/service/stripe-public-key/stripe-public-key.service';

const CoreModule = [CommonModule];
const SharedModule = [ErrorComponent, LoadShimmerComponent];

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
    console.log(signal);
  }

  async ngOnInit() {
    this.stripePublicKeyService.stripePublicKey().subscribe({
      next: async (response) => {
        console.log('public api', response.publicKey);
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
        console.log(response);
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
      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: 'http://localhost:4200/', // URL para redirecionar após o pagamento
        },
      });

      if (error) {
        console.error('Erro ao confirmar o pagamento:', error.message);
        alert(`Erro: ${error.message}`);
      } else {
        console.log('Pagamento realizado com sucesso!');
      }
    } catch (err) {
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
