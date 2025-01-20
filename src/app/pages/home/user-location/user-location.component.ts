import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../../shared/component/loading/loading.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { TrackAction } from '../../../shared/interface/track-action.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { GeolocationService } from '../../../shared/service/geolocation/geolocation.service';
import { LoggerService } from '../../../shared/service/logger/logger.service';
import { PreferencesUserAuthenticateService } from '../../../shared/service/preferences-user-authenticate/preferences-user-authenticate.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';
import { UserLocationService } from '../../../shared/service/user-location/user-location.service';

const SharedComponents = [
  ButtonStyleDirective,
  LoadingComponent,
  ModalComponent,
];
const CoreModule = [CommonModule];

@Component({
  selector: 'app-user-location',
  templateUrl: './user-location.component.html',
  styleUrls: ['./user-location.component.scss'],
  imports: [...SharedComponents, ...CoreModule],
  standalone: true,
})
export class UserLocationComponent implements OnInit, OnDestroy {
  buttonDisalbled: boolean = true;
  state: string = '';
  stateCode: string = '';
  city: string = '';
  isLoadingButton: boolean = true;
  isLoadingLocation: boolean = true;
  errorMessage: string = 'error';

  @ViewChild('modalErrorUserLocation') modalErrorUserLocation!: ModalComponent;
  @ViewChild('modalConfirmePermissionLocation')
  modalConfirmePermissionLocation!: ModalComponent;
  pageView: string = 'DatingMatch:UserLocation';
  destroy$: Subject<void> = new Subject<void>();
  continent: string = '';
  country: string = '';
  countryCode: string = '';
  currency: string = '';

  constructor(
    private geoLocationService: GeolocationService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private preferencesUserAuthenticateService: PreferencesUserAuthenticateService,
    private userLocationService: UserLocationService,
    private loggerService: LoggerService,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private cacheAvatarService: CacheAvatarService,
    private userHashPublicService: UserHashPublicService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.checkLocationPermission();
  }

  async checkLocationPermission() {
    const permissionStatus = await Geolocation.checkPermissions();

    if (permissionStatus.location === 'granted') {
      if (isPlatformBrowser(this.platformId)) {
        this.loadGeoLocation();
      }
    } else {
      this.modalConfirmePermissionLocation.openDialog();
    }
  }

  async handlePermissionRequest() {
    const permissionStatus = await Geolocation.requestPermissions();

    if (permissionStatus.location === 'granted') {
      this.modalConfirmePermissionLocation.closeDialog();
      this.loadGeoLocation();
    } else {
      this.errorMessage = 'Permissão de localização negada.';
      this.modalErrorUserLocation.openDialog();
    }
  }

  async loadGeoLocation() {
    this.isLoadingButton = true;
    this.isLoadingLocation = true;
    this.buttonDisalbled = true;

    try {
      const position = await Geolocation.getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      return this.geoLocationService
        .getGeolocation(latitude, longitude)
        .subscribe({
          next: (response) => {
            console.log('===>', response);
            this.state = response.results[0].components.state;
            this.city = response.results[0].components.city;
            this.stateCode = response.results[0].components.state_code;
            this.continent = response.results[0].components.continent;
            this.country = response.results[0].components.country;
            this.countryCode = response.results[0].components.country_code;
            this.currency = response.results[0].annotations.currency.iso_code;
          },
          error: (responseError) => {
            this.isLoadingButton = false;
            this.isLoadingLocation = false;
            this.buttonDisalbled = false;
            this.errorMessage = responseError.error.message.message;
            this.modalErrorUserLocation.openDialog();
            console.log(responseError);
          },
          complete: () => {
            this.isLoadingButton = false;
            this.isLoadingLocation = false;
            this.buttonDisalbled = false;
          },
        });
    } catch (responseError: any) {
      this.errorMessage = `error do try cacth: ${responseError}`;
      this.modalErrorUserLocation.openDialog();
      return `${responseError}: erro ao obter a localização do usuário.`;
    }
  }

  confirmUserLocation() {
    this.isLoadingButton = true;
    this.buttonDisalbled = true;

    this.userLocationService
      .location({
        state: this.state,
        stateCode: this.stateCode,
        city: this.city,
        continent: this.continent,
        country: this.country,
        countryCode: this.countryCode,
        currency: this.currency,
      })
      .subscribe({
        next: () => {
          this.preferencesUserAuthenticateService.getToken().subscribe({
            next: (response) => {
              if (response) {
                const updatedData = {
                  ...response,
                  userVerificationData: {
                    ...response.userVerificationData,
                    validatorLocation: true,
                  },
                };

                this.preferencesUserAuthenticateService
                  .savePreferences(updatedData)
                  .subscribe({
                    next: () => {
                      const logger: TrackAction = {
                        pageView: this.pageView,
                        category: 'user_user_location',
                        event: 'click',
                        label: 'button:Confirmar Localização',
                        message: JSON.stringify({
                          state: this.state,
                          stateCode: this.stateCode,
                          city: this.city,
                        }),
                        statusCode: 200,
                        level: 'info',
                      };

                      this.loggerService
                        .info(logger)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe();

                      this.router.navigateByUrl('home/user-description');
                    },
                    error: (saveError) => {
                      console.error('Erro ao salvar token:', saveError);
                      const logger: TrackAction = {
                        pageView: this.pageView,
                        category: 'user_user_location',
                        event: 'click',
                        label: 'button:Confirmar Localização',
                        message: saveError.message,
                        statusCode: 200,
                        level: 'error',
                      };

                      this.loggerService
                        .info(logger)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe();
                    },
                  });
              }
            },
            error: (getTokenError) => {
              console.error('Erro ao obter token:', getTokenError);
              const logger: TrackAction = {
                pageView: this.pageView,
                category: 'user_user_location',
                event: 'click',
                label: 'button:Confirmar Localização',
                message: getTokenError.message,
                statusCode: 200,
                level: 'error',
              };

              this.loggerService
                .info(logger)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
            },
          });
        },
        error: (responseError: HttpErrorResponse) => {
          this.errorMessage = responseError.error.message.message;

          const logger: TrackAction = {
            pageView: this.pageView,
            category: 'user_user_location',
            event: 'click',
            label: 'button:Confirmar Localização',
            message: this.errorMessage,
            statusCode: 200,
            level: 'error',
          };

          this.loggerService
            .info(logger)
            .pipe(takeUntil(this.destroy$))
            .subscribe();

          this.modalErrorUserLocation.openDialog();
        },
        complete: () => {
          this.isLoadingButton = false;
          this.buttonDisalbled = false;
        },
      });
  }

  logout() {
    this.tokenStorageSecurityRequestService.deleteToken();
    this.cacheAvatarService.resetAvatarCachePreferences();
    this.userHashPublicService.removeUserHashPublic();
    this.router.navigateByUrl('auth/sign');
  }
}
