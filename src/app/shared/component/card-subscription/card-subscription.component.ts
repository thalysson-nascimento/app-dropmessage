import { Component, OnInit } from '@angular/core';
import { ButtonStyleDirective } from '../../directives/button-style/button-style.directive';

const SharedComponents = [ButtonStyleDirective];

@Component({
  selector: 'app-card-subscription',
  templateUrl: './card-subscription.component.html',
  styleUrls: ['./card-subscription.component.scss'],
  standalone: true,
  imports: [...SharedComponents],
})
export class CardSubscriptionComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
