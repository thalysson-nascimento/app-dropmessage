import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Users } from '../../interface/last-logged-users.interface';

const CoreModule = [CommonModule, TranslateModule];

@Component({
  selector: 'app-last-logged-users',
  templateUrl: './last-logged-users.component.html',
  styleUrls: ['./last-logged-users.component.scss'],
  standalone: true,
  imports: [...CoreModule],
})
export class LastLoggedUsersComponent implements OnInit {
  @Input()
  userList: Users[] = [];
  constructor() {}

  ngOnInit() {}
}
