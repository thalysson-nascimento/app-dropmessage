import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadShimmerComponent } from '../../../shared/component/load-shimmer/load-shimmer.component';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { UserPostMessageElement } from '../../../shared/interface/user-post-message.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { UserPostMessageService } from '../../../shared/service/user-post-message/user-post-message.service';

const SahredComponents = [SystemUnavailableComponent, LoadShimmerComponent];

const CoreModule = [NgIf, NgFor];

@Component({
  selector: 'app-user-post-message',
  templateUrl: './user-post-message.component.html',
  styleUrls: ['./user-post-message.component.scss'],
  standalone: true,
  imports: [SahredComponents, CoreModule],
})
export class UserPostMessageComponent implements OnInit {
  isLoading: boolean = true;
  randomHeights = ['15rem'];
  listPostMessage!: UserPostMessageElement[];
  showSystemUnavailable: boolean = false;
  userName: string = '';

  constructor(
    private userPostMessageService: UserPostMessageService,
    private router: Router,
    private cacheAvatarService: CacheAvatarService
  ) {}

  ngOnInit() {
    this.loadUserName();
    this.loadUserPostMessage();
  }

  getRandomHeight(): string {
    const heights = ['15rem'];
    const index = Math.floor(Math.random() * heights.length);
    return heights[index];
  }

  loadUserName() {
    this.cacheAvatarService.getAvatarCachePreferences().subscribe({
      next: (response) => {
        this.userName = response.user.name;
      },
    });
  }

  loadUserPostMessage() {
    return this.userPostMessageService.userPostMessage().subscribe({
      next: (response) => {
        console.log(response);
        this.listPostMessage = response.userPostMessages;
        this.listPostMessage.forEach(() => {
          this.randomHeights.push(this.getRandomHeight());
        });
      },
      error: () => {
        this.showSystemUnavailable = true;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  tryAgain() {
    this.loadUserPostMessage();
  }

  goToProfile() {
    this.router.navigateByUrl('home/profile');
  }
}
