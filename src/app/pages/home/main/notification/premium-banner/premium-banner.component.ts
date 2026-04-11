import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-premium-banner',
  templateUrl: './premium-banner.component.html',
  styleUrls: ['./premium-banner.component.scss'],
  standalone: true,
})
export class PremiumBannerComponent implements OnInit {
  @Output() onClickButton = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onSubscribe() {
    this.onClickButton.emit();
  }
}
