import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-badge-circle',
  templateUrl: './badge-circle.component.html',
  styleUrls: ['./badge-circle.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class BadgeCircleComponent implements OnInit {
  @Input() title!: string;
  @Input() fontSize?: string = ''; // ~14px (default atual)
  @Input() padding?: string = '';

  constructor() {}

  ngOnInit() {}
}
