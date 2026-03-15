import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-error-request',
  templateUrl: './error-request.component.html',
  styleUrls: ['./error-request.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class ErrorRequestComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
