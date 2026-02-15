import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardsComponent } from '../../../shared/component/cards/cards.component';
import { ButtonDirective } from '../../../shared/directives/button-ia/button-ia.directive';

const SharedComponents = [ButtonDirective, CardsComponent];

@Component({
  selector: 'app-send-message-success',
  templateUrl: './send-message-success.component.html',
  styleUrls: ['./send-message-success.component.scss'],
  imports: [SharedComponents],
  standalone: true,
})
export class SendMessageSuccessComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigateByUrl('home/main/post-message');
  }

  takePicture() {
    this.router.navigateByUrl('home/take-picture-shared-message');
  }
}
