import { CommonModule } from '@angular/common';
import { HttpBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { currentEnvironment } from '../../../environment.config';
import { ButtonStyleDirective } from '../../shared/directives/button-style/button-style.directive';
import { MatchDataDetailsService } from '../../shared/service/match-details/match-data-details.service';
import { PostMock } from '../../shared/service/post/post.mock';
import { PostMessageService } from '../../shared/service/post/post.service';
import { SocketMatchService } from '../../shared/service/socket-match/socket-match.service';
import { DevelopmentRequestHttpBackend } from '../../shared/utils/developmentRequestHttpBackend/developmentRequestHttpBackend';

const environmentMock = currentEnvironment.mock;
const SharedComponents = [ButtonStyleDirective];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, ...SharedComponents],
  providers: [
    environmentMock
      ? [{ provide: HttpBackend, useClass: DevelopmentRequestHttpBackend }]
      : [],
    {
      provide: PostMessageService,
      useClass: environmentMock ? PostMock : PostMessageService,
    },
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  userId: string = '2693881d-8540-4190-9781-24f0bb37b19c';

  constructor(
    private socketMatchService: SocketMatchService,
    private router: Router,
    private matchDataDetailsService: MatchDataDetailsService
  ) {}

  ngOnInit(): void {
    this.onListenSocketMatch();
  }

  onListenSocketMatch() {
    this.socketMatchService.joinRoom(this.userId);
    this.socketMatchService.onMatchNotification().subscribe({
      next: (response) => {
        this.matchDataDetailsService.setMatchedDetails(response);
        this.router.navigateByUrl('home/match-notification');
        console.log('novo ==>>', response);
      },
      error: () => {},
    });
  }
}
