import { Component, Input, OnInit } from '@angular/core';
import { BadgeCircleComponent } from '../badge-circle/badge-circle.component';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  standalone: true,
  imports: [BadgeCircleComponent],
})
export class CardsComponent implements OnInit {
  @Input() image!: string;
  @Input() badge!: string;
  @Input() name!: string;
  @Input() userProfile!: string;

  constructor() {}

  ngOnInit() {}
}
