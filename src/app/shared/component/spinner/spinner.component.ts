import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
})
export class SpinnerComponent implements OnInit {
  @Input() size = 20;
  @Input() color = '#ffffff';
  @Input() backgroundColor = 'rgba(255,255,255,0.3)';

  constructor() {}

  ngOnInit() {}
}
