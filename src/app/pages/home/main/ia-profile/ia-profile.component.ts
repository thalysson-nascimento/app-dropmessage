import { NgFor } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CardLoadingShimmerComponent } from '../../../../shared/component/card-loading-shimmer/card-loading-shimmer.component';
import { CardsComponent } from '../../../../shared/component/cards/cards.component';
import { LoadShimmerComponent } from '../../../../shared/component/load-shimmer/load-shimmer.component';
import { LogoDropmessageComponent } from '../../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonIaDirective } from '../../../../shared/directives/button-ia/button-ia.directive';

register();

@Component({
  selector: 'app-ia-profile',
  templateUrl: './ia-profile.component.html',
  styleUrls: ['./ia-profile.component.scss'],
  standalone: true,
  imports: [
    LogoDropmessageComponent,
    CardsComponent,
    NgFor,
    ButtonIaDirective,
    CardLoadingShimmerComponent,
    LoadShimmerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IaProfileComponent implements OnInit {
  images: string[] = [
    'https://picsum.photos/500/700?random=1',
    'https://picsum.photos/500/700?random=2',
    'https://picsum.photos/500/700?random=3',
  ];

  ngOnInit() {}
}
