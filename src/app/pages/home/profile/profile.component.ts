import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostLikeStateComponent } from '../../../shared/component/post-like-state/post-like-state.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { AvatarSuccess } from '../../../shared/interface/avatar.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
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
  avatar!: AvatarSuccess;

  constructor(
    private router: Router,
    private userDataCacheService: UserDataCacheService,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private cacheAvatarService: CacheAvatarService
  ) {}

  ngOnInit() {
    this.loadCacheAvatar();
  }

  loadCacheAvatar() {
    this.cacheAvatarService.getDataAvatarCache().subscribe({
      next: (response) => {
        if (response) {
          this.avatar = response;
        }
      },
    });
    // this.userDataCacheService.getUserDataCache().subscribe({
    //   next: (response) => {
    //     if (response) {
    //       this.userData = response;
    //       console.log('this.userData', this.userData);
    //     }
    //   },
    // });
  }

  goToPostMessage() {
    this.router.navigateByUrl('home/post-messages');
  }

  logout() {
    this.tokenStorageSecurityRequestService.deleteToken();
    this.cacheAvatarService.resetDataAvatarCache();
    this.router.navigateByUrl('auth/sign'); // Redireciona para a rota signup
  }

  goToPrivecePolice() {
    this.router.navigateByUrl('auth/privacy-police');
  }
}
