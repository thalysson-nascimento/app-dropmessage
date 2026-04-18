import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { likeLimiteRewardAnimation } from '../../../shared/animation/like-limite-reward.animation';

@Component({
  selector: 'app-like-limite-reward',
  templateUrl: './like-limite-reward.component.html',
  styleUrls: ['./like-limite-reward.component.scss'],
  standalone: true,
  animations: likeLimiteRewardAnimation,
})
export class LikeLimiteRewardComponent implements OnInit {
  @Output() closeCard = new EventEmitter<void>();
  @Output() openReward = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  close() {
    this.closeCard.emit();
  }

  watchReward() {
    this.openReward.emit();
  }
}
