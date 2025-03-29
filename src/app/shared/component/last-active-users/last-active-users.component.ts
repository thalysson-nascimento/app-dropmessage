import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const CoreModules = [TranslateModule];

@Component({
  selector: 'app-last-active-users',
  templateUrl: './last-active-users.component.html',
  styleUrls: ['./last-active-users.component.scss'],
  imports: [...CoreModules],
  standalone: true,
})
export class LastActiveUsersComponent implements OnInit {
  @Input()
  gender: string = 'malell';

  constructor(private router: Router) {}

  ngOnInit() {}

  goToSharedPostMessage() {
    console.log('clicado');
  }
}
