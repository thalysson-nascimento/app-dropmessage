import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { DataConnectChatMessage } from '../../../shared/interface/data-connect-chat-message.interface';
import { MatchUsers } from '../../../shared/interface/match-users.interface';
import { DataConnectChatMessageService } from '../../../shared/service/data-connect-chat-message/data-connect-chat-message.service';
import { MatchDataDetailsService } from '../../../shared/service/match-details/match-data-details.service';
import { TokenStorageSecurityRequestService } from '../../../shared/service/token-storage-security-request/token-storage-security-request.service';

const SharedComponents = [ButtonStyleDirective];
@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
  imports: [...SharedComponents, CommonModule],
  standalone: true,
})
export class MatchComponent implements OnInit {
  initiatorImage: string = '';
  recipientImage: string = '';
  imageUser: string = '';
  matchUser!: MatchUsers | undefined;
  nameUserFormated!: string;
  firstNameMatch!: string;
  constructor(
    private matchDataDetailsService: MatchDataDetailsService,
    private tokenStorageSecurityRequestService: TokenStorageSecurityRequestService,
    private dataConnectChatMessageService: DataConnectChatMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.imageUser = 'https://www.designi.com.br/images/preview/10147228.jpg';
    this.getUserId();
  }

  getUserId() {
    this.tokenStorageSecurityRequestService.getToken().subscribe({
      next: (token) => {
        if (token) {
          const decoded = jwtDecode(token);
          this.loadMatchDetails(decoded.sub);
        }
      },
    });
  }

  loadMatchDetails(userId: string | undefined) {
    this.matchDataDetailsService
      .getMatchedDetails()
      .subscribe((response: MatchUsers[]) => {
        const filteredUser = response.find((user) => user.id !== userId);
        this.matchUser = filteredUser;
        this.nameUserFormated = this.formatName(String(this.matchUser?.name));
        this.firstNameMatch = this.findFirstName(String(this.matchUser?.name));
      });
  }

  formatName(fullName: string): string {
    const firstName = fullName.split(' ')[0];
    return firstName.length > 5 ? `${firstName.slice(0, 5)}...` : firstName;
  }

  findFirstName(fullName: string) {
    return fullName.split(' ')[0];
  }

  goToBack() {
    window.history.back();
  }

  goToPrivacyChat() {
    if (this.matchUser) {
      const userMatch: DataConnectChatMessage = {
        mathId: this.matchUser?.matchId,
        name: this.matchUser?.name,
        avatar: this.matchUser?.avatar?.image,
        userLocation: {
          stateCode: this.matchUser?.UserLocation?.stateCode,
          city: this.matchUser?.UserLocation?.city,
        },
      };
      this.dataConnectChatMessageService.setDataConnectChatMessage(userMatch);
      this.router.navigateByUrl('home/chat-message');
    }
  }
}
