import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingComponent } from '../../../shared/component/loading/loading.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { GeolocationService } from '../../../shared/service/geolocation/geolocation.service';
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
export class UserLocationComponent implements OnInit {
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

  constructor(
    private geoLocationService: GeolocationService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userLocationService: UserLocationService
  ) {}

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
            this.state = response.results[0].components.state;
            this.city = response.results[0].components.city;
            this.stateCode = response.results[0].components.state_code;
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
    this.buttonDisalbled = true;
    this.isLoadingButton = true;

    this.userLocationService
      .location({
        state: this.state,
        stateCode: this.stateCode,
        city: this.city,
      })
      .subscribe({
        next: () => {
          this.router.navigateByUrl('home/post-messages');
        },
        error: (responseError: HttpErrorResponse) => {
          console.log(responseError);
          this.isLoadingButton = false;
          this.buttonDisalbled = false;
          this.errorMessage = responseError.error.message.message;
          this.modalErrorUserLocation.openDialog();
        },
        complete: () => {
          this.isLoadingButton = false;
          this.buttonDisalbled = false;
        },
      });
  }
}
