import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonStyleDirective } from '../../../shared/directives/button-style/button-style.directive';
import { MatchDetails } from '../../../shared/interface/match-details.interface';
import { MatchDataDetailsService } from '../../../shared/service/match-details/match-data-details.service';

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
  constructor(private matchDataDetailsService: MatchDataDetailsService) {}

  ngOnInit() {
    this.loadMatchDetails();
  }

  loadMatchDetails() {
    this.matchDataDetailsService
      .getMatchedDetails()
      .subscribe((response: MatchDetails[]) => {
        console.log('========================>', response);
        this.initiatorImage = response[0].avatar;
        this.recipientImage = response[1].avatar;
      });
  }

  goToBack() {
    window.history.back();
  }

  goToProfile() {}
}
