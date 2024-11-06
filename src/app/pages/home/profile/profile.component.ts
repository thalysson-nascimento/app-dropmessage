import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostLikeStateComponent } from '../../../shared/component/post-like-state/post-like-state.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { UserData } from '../../../shared/interface/user-data.interface';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { UserDataCacheService } from '../../../shared/service/user-cache/user-data-cache.service';

const SharedComponent = [PostLikeStateComponent, ButtonStyleDirective];

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [...SharedComponent],
})
export class ProfileComponent implements OnInit {
  userData!: UserData;

  constructor(
    private router: Router,
    private userDataCacheService: UserDataCacheService,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService
  ) {}

  ngOnInit() {
    this.loadUserDataCache();
  }

  loadUserDataCache() {
    this.userDataCacheService.getUserDataCache().subscribe({
      next: (response) => {
        if (response) {
          this.userData = response;
          console.log('this.userData', this.userData);
        }
      },
    });
  }

  goToPostMessage() {
    this.router.navigateByUrl('home/post-messages');
  }

  goToSign() {
    this.tokenStorageSecurityRequestService.deleteToken();
    this.userDataCacheService.resetUserDataCache();
    this.router.navigateByUrl('auth/sign'); // Redireciona para a rota signup
  }
}
