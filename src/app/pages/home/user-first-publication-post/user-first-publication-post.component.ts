import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ErrorComponent } from '../../../shared/component/error/error.component';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { FirstPublicationRegisterGoldFreeService } from '../../../shared/service/first-publication-register-gold-free/first-publication-register-gold-free.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';

const SharedComponents = [ErrorComponent, LoadShimmerComponent, ErrorComponent];
const CoreModule = [CommonModule];

@Component({
  selector: 'app-user-first-publication-post',
  templateUrl: './user-first-publication-post.component.html',
  styleUrls: ['./user-first-publication-post.component.scss'],
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
})
export class UserFirstPublicationPostComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;
  errorRequest: boolean = false;
  destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private firstPublicationRegisterGoldFreeService: FirstPublicationRegisterGoldFreeService,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService
  ) {}

  ngOnInit() {
    this.sendDataUserFirstPublication();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToPostMessages() {
    this.router.navigateByUrl('home/main/post-message');
  }

  sendDataUserFirstPublication() {
    this.firstPublicationRegisterGoldFreeService.firstPublication().subscribe({
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
                    firstPublicationPostMessage: true,
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
        this.isLoading = false;
        this.errorRequest = true;
      },
    });
  }
}
