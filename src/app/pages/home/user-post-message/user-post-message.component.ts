import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SystemUnavailableComponent } from '../../../shared/component/system-unavailable/system-unavailable.component';
import { UserPostMessageElement } from '../../../shared/interface/user-post-message.interface';
import { CacheAvatarService } from '../../../shared/service/cache-avatar/cache-avatar.service';
import { LottieAnimationIconService } from '../../../shared/service/lottie-animation-icon/lottie-animation-icon.service';
import { UserPostMessageService } from '../../../shared/service/user-post-message/user-post-message.service';

const SahredComponents = [SystemUnavailableComponent];

const CoreModule = [NgIf, NgFor];

@Component({
  selector: 'app-user-post-message',
  templateUrl: './user-post-message.component.html',
  styleUrls: ['./user-post-message.component.scss'],
  standalone: true,
  imports: [SahredComponents, CoreModule],
})
export class UserPostMessageComponent implements OnInit, AfterViewInit {
  isLoading: boolean = true;
  randomHeights = ['15rem'];
  listPostMessage!: UserPostMessageElement[];
  showSystemUnavailable: boolean = false;
  userName: string = '';

  constructor(
    private userPostMessageService: UserPostMessageService,
    private router: Router,
    private cacheAvatarService: CacheAvatarService,
    private lottieAnimationIconService: LottieAnimationIconService
  ) {}

  ngOnInit() {
    this.loadUserName();
    this.loadUserPostMessage();
  }

  ngAfterViewInit(): void {
    this.lottieAnimationIconService.loadLottieAnimation({
      pathIconAnimation: 'loading.json',
      idElement: 'lottie-icon-is-loading',
      loop: true,
      autoplay: true,
    });
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
