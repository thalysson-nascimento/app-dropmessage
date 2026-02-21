import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';
import { SharedPostMessage } from '../../../shared/interface/shared-post-message.interface';

export interface FeatureItem {
  icon: string;
  title: string;
  subtitle: string;
}

const SharedComponents = [ButtonDirective, TranslateModule];

@Component({
  selector: 'app-plan-gold-free-trial',
  templateUrl: './plan-gold-free-trial.component.html',
  styleUrls: ['./plan-gold-free-trial.component.scss'],
  imports: [...SharedComponents],
  standalone: true,
})
export class PlanGoldFreeTrialComponent implements OnInit {
  public sharedPost?: SharedPostMessage;
  features: FeatureItem[] = [
    {
      icon: 'block',
      title: 'Sem anúncios',
      subtitle: 'Navegue sem interrupções',
    },
    {
      icon: 'favorite',
      title: '300 curtidas',
      subtitle: 'Receba até 300 likes',
    },
    {
      icon: 'location_on',
      title: 'Localização dos matchs',
      subtitle: 'Veja onde seus matchs estão',
    },
    {
      icon: 'visibility',
      title: 'Veja quem curtiu você',
      subtitle: 'Descubra quem demonstrou interesse',
    },
  ];

  constructor(private router: Router, private translate: TranslateService) {}

  ngOnInit() {
    const state = window.history.state as { response?: SharedPostMessage };

    if (!state?.response) return;

    this.sharedPost = state.response;
  }

  goBack() {
    if (this.sharedPost?.showADS) {
      return this.router.navigateByUrl('home/admob-video-reward-free-trial');
    }

    return this.router.navigateByUrl('home/main/post-message');
  }

  takePicture() {
    this.router.navigateByUrl('home/take-picture-shared-message');
  }
}
