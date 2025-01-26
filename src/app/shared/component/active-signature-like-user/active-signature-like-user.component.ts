import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonStyleDirective } from '../../directives/button-style/button-style.directive';
import { LastLikePostMessage } from '../../interface/last-like-post-message.interface';
import { LastLikePostMessageService } from '../../service/last-like-post-message/last-like-post-message.service';
import { ErrorComponent } from '../error/error.component';
import { LoadShimmerComponent } from '../load-shimmer/load-shimmer.component';

const SharedComponents = [
  ButtonStyleDirective,
  ErrorComponent,
  LoadShimmerComponent,
];

@Component({
  selector: 'app-active-signature-like-user',
  templateUrl: './active-signature-like-user.component.html',
  styleUrls: ['./active-signature-like-user.component.scss'],
  standalone: true,
  imports: [...SharedComponents],
})
export class ActiveSignatureLikeUserComponent implements OnInit {
  isLoading: boolean = true;
  errorRequest: boolean = false;
  lastLikePostMessage!: LastLikePostMessage;

  constructor(
    private router: Router,
    private lastLikePostMessageService: LastLikePostMessageService
  ) {}

  ngOnInit() {
    this.loadLoastLikePostMessage();
  }

  listSubscription() {
    this.router.navigateByUrl('home/list-subscription');
  }

  loadLoastLikePostMessage() {
    this.lastLikePostMessageService.lastLike().subscribe({
      next: (response) => {
        console.log(response);
        this.lastLikePostMessage = response;
      },
      error: (error) => {
        this.errorRequest = true;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.errorRequest = false;
      },
    });
  }

  filterFirstUserName(userName: string) {
    return userName.split(' ')[0];
  }
}
