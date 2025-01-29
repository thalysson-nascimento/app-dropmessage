import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
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
const CoreModule = [CommonModule];

@Component({
  selector: 'app-view-card-free-trial',
  templateUrl: './view-card-free-trial.component.html',
  styleUrls: ['./view-card-free-trial.component.scss'],
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
})
export class ViewCardFreeTrialComponent implements OnInit {
  isLoading: boolean = true;
  errorRequest: boolean = false;
  constructor(
    private viewCardFreeTrialService: ViewCardFreeTrialService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService,
    private router: Router,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit() {
    this.userViewCard();
  }

  userViewCard() {
    this.viewCardFreeTrialService.viewCard().subscribe({
      next: () => {
        this.preferencesUserAuthenticateService.getToken().subscribe({
          next: (response) => {
            console.log(response);
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
        console.log(error);
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
