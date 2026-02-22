import { NgFor } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { CardLoadingShimmerComponent } from '../../../../shared/component/card-loading-shimmer/card-loading-shimmer.component';
import { CardsComponent } from '../../../../shared/component/cards/cards.component';
import { ErrorRequestComponent } from '../../../../shared/component/error-request/error-request.component';
import { LoadShimmerComponent } from '../../../../shared/component/load-shimmer/load-shimmer.component';
import { LogoDropmessageComponent } from '../../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonDirective } from '../../../../shared/directives/button-ia/button-ia.directive';

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
    ButtonDirective,
    CardLoadingShimmerComponent,
    LoadShimmerComponent,
    ErrorRequestComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IaProfileComponent implements OnInit {
  public loading = true;
  public error = false;
  images: string[] = [
    'https://picsum.photos/500/700?random=1',
    'https://picsum.photos/500/700?random=2',
    'https://picsum.photos/500/700?random=3',
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  goToIAProfileDetails() {
    this.router.navigateByUrl('/home/ia-profile-details');
  }
}
