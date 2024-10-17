import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo-dropmessage',
  templateUrl: './logo-dropmessage.component.html',
  styleUrls: ['./logo-dropmessage.component.scss'],
  standalone: true,
})
export class LogoDropmessageComponent implements OnInit {
  @Input()
  fontSize?: string = '1rem';

  constructor() {}

  ngOnInit() {}
}
