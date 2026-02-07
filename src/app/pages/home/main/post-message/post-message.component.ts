import { Component, OnInit } from '@angular/core';
import { CardsComponent } from '../../../../shared/component/cards/cards.component';
import { LogoDropmessageComponent } from '../../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonIaDirective } from '../../../../shared/directives/button-ia/button-ia.directive';

@Component({
  selector: 'app-post-message',
  templateUrl: './post-message.component.html',
  styleUrls: ['./post-message.component.scss'],
  imports: [LogoDropmessageComponent, CardsComponent, ButtonIaDirective],
  standalone: true,
})
export class PostMessageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  openBottomSheet(): void {}
}
