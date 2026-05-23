import { NgFor } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { register } from 'swiper/element/bundle';
import { CardLoadingShimmerComponent } from '../../../../shared/component/card-loading-shimmer/card-loading-shimmer.component';
import { CardsComponent } from '../../../../shared/component/cards/cards.component';
import { ErrorRequestComponent } from '../../../../shared/component/error-request/error-request.component';
import { LoadShimmerComponent } from '../../../../shared/component/load-shimmer/load-shimmer.component';
import { LogoDropmessageComponent } from '../../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonDirective } from '../../../../shared/directives/button-ia/button-ia.directive';
import { AIProfileInterface } from '../../../../shared/interface/ai-profile.interface';
import { AiProfilesService } from '../../../../shared/service/ai-profiles/ai-profiles.service';

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
    TranslateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IaProfileComponent implements OnInit {
  public loading = false;
  public error = false;
  public aiProfiles!: AIProfileInterface[];

  constructor(
    private router: Router,
    private aiProfilesService: AiProfilesService
  ) {}

  ngOnInit() {
    this.loadAiProfile();
  }

  loadAiProfile() {
    this.loading = true;
    this.aiProfilesService.profiles().subscribe({
      next: (response) => {
        this.aiProfiles = response;
        this.loading = false;
        this.error = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  goToIAProfileDetails(ai: AIProfileInterface) {
    localStorage.setItem('aiProfile', JSON.stringify(ai));

    this.router.navigate(['/home/ia-profile-details'], {
      state: { aiProfile: ai },
    });
  }
}
