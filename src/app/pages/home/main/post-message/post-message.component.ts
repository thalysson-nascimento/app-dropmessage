import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardLoadingShimmerComponent } from '../../../../shared/component/card-loading-shimmer/card-loading-shimmer.component';
import { CardsComponent } from '../../../../shared/component/cards/cards.component';
import { ErrorRequestComponent } from '../../../../shared/component/error-request/error-request.component';
import { LoadShimmerComponent } from '../../../../shared/component/load-shimmer/load-shimmer.component';
import { LogoDropmessageComponent } from '../../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonDirective } from '../../../../shared/directives/button-ia/button-ia.directive';

@Component({
  selector: 'app-post-message',
  templateUrl: './post-message.component.html',
  styleUrls: ['./post-message.component.scss'],
  imports: [
    LogoDropmessageComponent,
    CardsComponent,
    ButtonDirective,
    ErrorRequestComponent,
    CardLoadingShimmerComponent,
    LoadShimmerComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class PostMessageComponent implements OnInit {
  public loading = false;
  public error = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  goToTakePicture(): void {
    this.router.navigateByUrl('home/take-picture-shared-message');
  }

  goToIAProfile() {
    this.router.navigate(['home/main/ia-profile']);
  }
}
