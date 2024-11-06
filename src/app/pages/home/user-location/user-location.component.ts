import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
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
  buttonDisalbled: boolean = false;
  state: string = '';
  stateCode: string = '';
  city: string = '';
  isLoadingButton: boolean = false;
  isLoadingLocation: boolean = false;
  errorMessage: string = 'error';

  @ViewChild('modalErrorUserLocation') modalErrorUserLocation!: ModalComponent;

  constructor(
    private geoLocationService: GeolocationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userLocationService: UserLocationService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGeoLocation();
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
          error: (error) => {
            this.isLoadingButton = false;
            this.isLoadingLocation = false;
            this.buttonDisalbled = false;
            console.log(error);
          },
          complete: () => {
            this.isLoadingButton = false;
            this.isLoadingLocation = false;
            this.buttonDisalbled = false;
          },
        });
    } catch (error) {
      return `${error}: erro ao obter a localização do usuário.`;
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
        next: (response) => {
          console.log(response);
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
