import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-load-shimmer',
  templateUrl: './load-shimmer.component.html',
  styleUrls: ['./load-shimmer.component.scss'],
  standalone: true,
})
export class LoadShimmerComponent implements OnInit {
  @Input() height?: string = '5.5rem';
  constructor() {}

  ngOnInit() {}
}
