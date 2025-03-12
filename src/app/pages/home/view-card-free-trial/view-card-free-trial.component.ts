import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { BottomSheetComponent } from '../../../shared/bottom-sheet/bottom-sheet.component';
import { ErrorComponent } from '../../../shared/component/error/error.component';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { ViewCardFreeTrialService } from '../../../shared/service/vire-card-free-trial/view-card-free-trial.service';

const SharedComponents = [
  ErrorComponent,
  LoadShimmerComponent,
  ButtonStyleDirective,
];
const CoreModule = [CommonModule, TranslateModule];

@Component({
  selector: 'app-view-card-free-trial',
  templateUrl: './view-card-free-trial.component.html',
  styleUrls: ['./view-card-free-trial.component.scss'],
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
})
export class ViewCardFreeTrialComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;
  errorRequest: boolean = false;
  destroy$: Subject<void> = new Subject<void>();

  constructor(
    private viewCardFreeTrialService: ViewCardFreeTrialService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService,
    private router: Router,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit() {
    this.userViewCard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  userViewCard() {
    this.viewCardFreeTrialService.viewCard().subscribe({
      next: () => {
        this.preferencesUserAuthenticateService
          .getToken()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response) {
                const updatedData = {
                  ...response,
                  goldFreeTrialData: {
                    ...response.goldFreeTrialData,
                    viewCardFreeTrial: true,
                  },
                };
                this.preferencesUserAuthenticateService
                  .savePreferences(updatedData)
                  .subscribe();
              }
            },
          });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorRequest = true;
        this.isLoading = false;
      },
    });
  }

  goToPostMessages() {
    this.router.navigateByUrl('home/post-messages');
  }

  goToSharedPostMessages() {
    this.router.navigateByUrl('home/take-picture-shared-message');
  }

  openBottomSheet() {
    this.bottomSheet.open(BottomSheetComponent);
  }
}
