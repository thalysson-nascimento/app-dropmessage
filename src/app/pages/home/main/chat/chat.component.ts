import { Component, OnInit } from '@angular/core';
import { ErrorRequestComponent } from '../../../../shared/component/error-request/error-request.component';
import { LogoDropmessageComponent } from '../../../../shared/component/logo-dropmessage/logo-dropmessage.component';
import { ButtonDirective } from '../../../../shared/directives/button-ia/button-ia.directive';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [LogoDropmessageComponent, ErrorRequestComponent, ButtonDirective],
  standalone: true,
})
export class ChatComponent implements OnInit {
  public loading = false;
  public error = true;

  constructor() {}

  ngOnInit() {}
}
