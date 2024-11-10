import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostLikeStateComponent } from '../../../shared/component/post-like-state/post-like-state.component';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { AvatarSuccess } from '../../../shared/interface/avatar.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';

const CoreModule = [NgIf];
const SharedComponent = [PostLikeStateComponent, ButtonStyleDirective];

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [...SharedComponent, ...CoreModule],
})
export class ProfileComponent implements OnInit {
  avatar!: AvatarSuccess;

  constructor(
    private router: Router,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private cacheAvatarService: CacheAvatarService
  ) {}

  ngOnInit() {
    this.loadCacheAvatar();
  }

  loadCacheAvatar() {
    this.cacheAvatarService.getAvatarCachePreferences().subscribe({
      next: (response) => {
        if (response) {
          this.avatar = response;
        } else {
          console.log('Avatar não encontrado no cache.');
        }
      },
      error: (error) => {
        console.log('Erro ao carregar avatar do cache:', error);
      },
    });
  }

  goToPostMessage() {
    this.router.navigateByUrl('home/post-messages');
  }

  logout() {
    this.tokenStorageSecurityRequestService.deleteToken();
    this.cacheAvatarService.resetAvatarCachePreferences();
    this.router.navigateByUrl('auth/sign');
  }

  goToPrivecePolice() {
    this.router.navigateByUrl('auth/privacy-police');
  }

  goToNotification() {
    this.router.navigateByUrl('home/notification');
  }
}
