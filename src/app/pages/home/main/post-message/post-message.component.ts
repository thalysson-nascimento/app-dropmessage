import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private router: Router) {}

  ngOnInit() {}

  goToTakePicture(): void {
    this.router.navigateByUrl('home/take-picture-shared-message');
  }

  goToIAProfile() {
    this.router.navigate(['home/main/ia-profile']);
  }
}
