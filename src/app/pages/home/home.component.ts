import { CommonModule } from '@angular/common';
import { HttpBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { currentEnvironment } from '../../../environment.config';
import { MatchDataDetailsService } from '../../shared/service/match-details/match-data-details.service';
import { PostMock } from '../../shared/service/post/post.mock';
import { PostMessageService } from '../../shared/service/post/post.service';
import { SocketMatchService } from '../../shared/service/socket-match/socket-match.service';
import { TokenStorageSecurityRequestService } from '../../shared/service/token-storage-security-request/token-storage-security-request.service';
import { DevelopmentRequestHttpBackend } from '../../shared/utils/developmentRequestHttpBackend/developmentRequestHttpBackend';

const environmentMock = currentEnvironment.mock;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
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
  constructor(
    private socketMatchService: SocketMatchService,
    private router: Router,
    private matchDataDetailsService: MatchDataDetailsService,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService
  ) {}

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    this.tokenStorageSecurityRequestService.getToken().subscribe({
      next: (token) => {
        if (token) {
          const decoded = jwtDecode(token);
          this.onListenSocketMatch(decoded.sub);
        }
      },
    });
  }

  onListenSocketMatch(userId: string | undefined) {
    console.log('match userId ===>', userId);
    this.socketMatchService.joinRoom(userId);
    this.socketMatchService.onMatchNotification().subscribe({
      next: (response) => {
        this.matchDataDetailsService.setMatchedDetails(response);
        this.router.navigateByUrl('home/match');
      },
      error: (error) => {
        console.warn('Esta ocorrendo o erro de rediercionamento no match');
        console.log(error);
      },
    });
  }
}
