import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';

export interface FeatureItem {
  icon: string;
  title: string;
  subtitle: string;
}

const SharedComponents = [ButtonDirective];

@Component({
  selector: 'app-plan-gold-free-trial',
  templateUrl: './plan-gold-free-trial.component.html',
  styleUrls: ['./plan-gold-free-trial.component.scss'],
  imports: [...SharedComponents],
  standalone: true,
})
export class PlanGoldFreeTrialComponent implements OnInit {
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

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigateByUrl('home/main/post-message');
  }

  takePicture() {
    this.router.navigateByUrl('home/take-picture-shared-message');
  }
}
