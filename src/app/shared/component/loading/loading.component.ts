import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
})
export class LoadingComponent implements OnInit {
  @Input()
  width: string = '50px';
  @Input()
  height: string = '50px';
  @Input()
  lineHeight: string = '5px';
  background?: string = '#f3f3f3';

  constructor() {}

  ngOnInit() {}

  sizeLoading() {
    return {
      width: this.width,
      height: this.height,
      border: `${this.lineHeight} solid ${this.background}`,
      'border-top': `${this.lineHeight} solid #3498db`,
    };
  }
}
