import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AdmobService } from '../../../shared/service/ad-mob/ad-mob.service';

@Component({
  selector: 'app-admob-intertistial',
  templateUrl: './admob-intertistial.component.html',
  styleUrls: ['./admob-intertistial.component.scss'],
  standalone: true,
})
export class AdmobIntertistialComponent implements OnInit {
  isLoading = true;
  statusMessage = 'Preparando anúncio...';

  // 👇 controle do mock
  mockStep: 'loading' | 'playing' | 'finished' = 'loading';
  progress = 0;

  constructor(private admobService: AdmobService, private router: Router) {}

  async ngOnInit() {
    console.log('[Component] Iniciando fluxo interstitial');

    const isWeb = Capacitor.getPlatform() === 'web';

    try {
      this.statusMessage = 'Carregando anúncio...';

      // 👇 MOCK VISUAL (só no web)
      if (isWeb) {
        this.startMockFlow();
      }

      await this.admobService.showInterstitial();

      console.log('[Component] Anúncio finalizado');
    } catch (e) {
      console.log('[Component] Erro interstitial', e);
      this.statusMessage = 'Erro ao carregar anúncio';
    } finally {
      this.isLoading = false;

      console.log('[Component] Redirecionando...');

      this.router.navigateByUrl('home/main/post-message');
    }
  }

  private startMockFlow() {
    console.log('[MOCK] Iniciando simulação visual');

    this.mockStep = 'loading';

    setTimeout(() => {
      this.mockStep = 'playing';
      this.statusMessage = 'Assistindo anúncio...';

      let interval = setInterval(() => {
        this.progress += 10;
        console.log('[MOCK] progresso:', this.progress);

        if (this.progress >= 100) {
          clearInterval(interval);
          this.mockStep = 'finished';
          this.statusMessage = 'Anúncio concluído';
        }
      }, 300);
    }, 800);
  }
}
