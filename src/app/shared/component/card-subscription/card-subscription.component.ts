import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonStyleDirective } from '../../directives/button-style/button-style.directive';

const SharedComponents = [ButtonStyleDirective];

@Component({
  selector: 'app-card-subscription',
  templateUrl: './card-subscription.component.html',
  styleUrls: ['./card-subscription.component.scss'],
  standalone: true,
  imports: [...SharedComponents, TranslateModule],
})
export class CardSubscriptionComponent implements OnInit {
  @Output() onClickButton = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  handleClickButton() {
    this.onClickButton.emit();
  }
}
