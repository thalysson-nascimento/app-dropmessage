import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-badge-circle',
  templateUrl: './badge-circle.component.html',
  styleUrls: ['./badge-circle.component.scss'],
  standalone: true,
})
export class BadgeCircleComponent implements OnInit {
  @Input() title!: string;
  constructor() {}

  ngOnInit() {}
}
