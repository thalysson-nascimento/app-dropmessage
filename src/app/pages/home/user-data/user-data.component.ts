import { NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { ListStyleDirective } from '../../../shared/directives/list-style/list-style.directive';
import { MyProfile } from '../../../shared/interface/my-profile.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { DeleteAccountService } from '../../../shared/service/delete-account/delete-account.service';
import { LottieAnimationIconService } from '../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';
import { MyProfileService } from '../../../shared/service/my-profile/my-profile.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserHashPublicService } from '../../../shared/service/user-hash-public/user-hash-public.service';

const SharedComponents = [
  SystemUnavailableComponent,
  ListStyleDirective,
  ButtonStyleDirective,
  ModalComponent,
];
const CoreModule = [NgIf];

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  standalone: true,
  imports: [...SharedComponents, ...CoreModule],
})
export class UserDataComponent implements OnInit, AfterViewInit {
  isLoading: boolean = true;
  showSystemUnavailable: boolean = false;
  myProfile!: MyProfile;
  buttonDisalbled: boolean = false;
  @ViewChild('dialog') modal!: ModalComponent;

  constructor(
    private router: Router,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private cacheAvatarService: CacheAvatarService,
    private userHashPublicService: UserHashPublicService,
    private myProfileService: MyProfileService,
    private lottieAnimationIconService: LottieAnimationIconService,
    private deleteAccountService: DeleteAccountService
  ) {}

  ngOnInit() {
    this.loadMyProfile();
  }

  ngAfterViewInit(): void {
    this.lottieAnimationIconService.loadLottieAnimation({
      pathIconAnimation: 'loading.json',
      idElement: 'lottie-icon-is-loading',
      loop: true,
      autoplay: true,
    });
  }

  goToProfile() {
    this.router.navigateByUrl('home/profile');
  }

  tryAgain() {}

  loadMyProfile() {
    this.myProfileService.myProfile().subscribe({
      next: (response) => {
        console.log('===>', response);
        this.myProfile = response;
      },
      error: (error) => {
        console.log(error);
        this.showSystemUnavailable = true;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.showSystemUnavailable = false;
      },
    });
  }

  openModal() {
    this.modal.openDialog();
  }

  deleteAccount() {
    this.buttonDisalbled = true;
    this.deleteAccountService.deleteAccount().subscribe({
      next: () => {
        this.tokenStorageSecurityRequestService.deleteToken();
        this.cacheAvatarService.resetAvatarCachePreferences();
        this.userHashPublicService.removeUserHashPublic();
        this.buttonDisalbled = false;
        this.router.navigateByUrl('auth/sign');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
