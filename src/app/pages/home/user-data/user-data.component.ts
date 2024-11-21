import { NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { ListStyleDirective } from '../../../shared/directives/list-style/list-style.directive';
import { MyProfile } from '../../../shared/interface/my-profile.interface';
import { LottieAnimationIconService } from '../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';
import { MyProfileService } from '../../../shared/service/my-profile/my-profile.service';

const SharedComponents = [SystemUnavailableComponent, ListStyleDirective];
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

  constructor(
    private router: Router,
    private myProfileService: MyProfileService,
    private lottieAnimationIconService: LottieAnimationIconService
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
}
