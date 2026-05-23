import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { differenceInSeconds, formatDistanceStrict } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';
import { SharedPostMessage } from '../../../shared/interface/shared-post-message.interface';

const SharedComponents = [ButtonDirective, TranslateModule];

@Component({
  selector: 'app-send-message-success',
  templateUrl: './send-message-success.component.html',
  styleUrls: ['./send-message-success.component.scss'],
  imports: [SharedComponents],
  standalone: true,
})
export class SendMessageSuccessComponent implements OnInit {
  public sharedPost?: SharedPostMessage;

  constructor(private router: Router, private translate: TranslateService) {}

  ngOnInit() {
    const state = window.history.state as { response?: SharedPostMessage };

    if (!state?.response) return;

    this.sharedPost = state.response;
    console.log(this.sharedPost);
  }

  goBack() {
    if (this.sharedPost?.showADS) {
      return this.router.navigateByUrl('home/admob-intertistial');
    }

    return this.router.navigateByUrl('home/main/post-message');
  }

  takePicture() {
    this.router.navigateByUrl('home/take-picture-shared-message');
  }

  formatTimeLeft(expirationDate: Date | undefined): string {
    if (!expirationDate) return '';

    const now = new Date();
    const expiration = new Date(expirationDate);

    const secondsLeft = differenceInSeconds(expiration, now);

    if (secondsLeft <= 0) {
      return this.translate.currentLang === 'en' ? 'Expired' : 'Expirado';
    }

    return formatDistanceStrict(expiration, now, {
      locale: this.translate.currentLang === 'en' ? enUS : ptBR,
    });
  }
}
